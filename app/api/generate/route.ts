import { NextRequest, NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai/client";
import { buildPrompt } from "@/lib/ai/prompt";
import { UserContext, GeneratedName } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ZHIPU_API_KEY) {
      return NextResponse.json(
        { error: "服务未配置 API Key，请联系管理员" },
        { status: 500 }
      );
    }

    const { context } = (await req.json()) as { context: Partial<UserContext> };

    if (!context.surname || typeof context.surname !== "string") {
      return NextResponse.json(
        { error: "姓氏不能为空" },
        { status: 400 }
      );
    }

    // 限制 surname 长度，防止滥用
    if (context.surname.length > 10) {
      return NextResponse.json(
        { error: "姓氏过长" },
        { status: 400 }
      );
    }

    const client = getAIClient();
    const prompt = buildPrompt(context);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let response;
    try {
      response = await client.chat.completions.create(
        {
          model: "glm-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        },
        { signal: controller.signal }
      );
    } finally {
      clearTimeout(timeout);
    }

    const content = response.choices[0]?.message?.content || "";

    // 从返回内容中提取 JSON — 使用更精确的匹配
    let names: GeneratedName[] = [];
    try {
      // 匹配以 [{ 开始的 JSON 数组（非贪婪）
      const jsonMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      if (jsonMatch) {
        const raw = JSON.parse(jsonMatch[0]);
        if (Array.isArray(raw)) {
          names = raw
            .filter(
              (item: Record<string, unknown>) =>
                item && typeof item.givenName === "string" && item.givenName
            )
            .map(
              (
                item: Record<string, unknown>,
                index: number
              ) => ({
                id: `name-${Date.now()}-${index}`,
                surname: context.surname || "",
                givenName: String(item.givenName),
                pinyin: String(item.pinyin || ""),
                meaning: String(item.meaning || "暂无解释"),
                source: String(item.source || "原创"),
                wuxingAnalysis: String(item.wuxingAnalysis || "暂无分析"),
                personalConnection: String(item.personalConnection || ""),
              })
            );
        }
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
    }

    if (names.length === 0) {
      return NextResponse.json(
        { error: "AI 未能生成有效的名字，请重试" },
        { status: 500 }
      );
    }

    return NextResponse.json({ names });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "AI 响应超时，请重试"
        : "生成失败，请稍后重试";
    console.error("Generate error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
