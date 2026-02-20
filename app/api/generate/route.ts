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

    if (!context.surname) {
      return NextResponse.json(
        { error: "姓氏不能为空" },
        { status: 400 }
      );
    }

    const client = getAIClient();
    const prompt = buildPrompt(context);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await client.chat.completions.create(
      {
        model: "glm-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const content = response.choices[0]?.message?.content || "";

    // 从返回内容中提取 JSON
    let names: GeneratedName[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const raw = JSON.parse(jsonMatch[0]);
        names = raw.map(
          (
            item: {
              givenName: string;
              pinyin: string;
              meaning: string;
              source: string;
              wuxingAnalysis: string;
              personalConnection: string;
            },
            index: number
          ) => ({
            id: `name-${Date.now()}-${index}`,
            surname: context.surname,
            givenName: item.givenName,
            pinyin: item.pinyin,
            meaning: item.meaning,
            source: item.source || "原创",
            wuxingAnalysis: item.wuxingAnalysis,
            personalConnection: item.personalConnection,
          })
        );
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content);
    }

    if (names.length === 0) {
      return NextResponse.json(
        { error: "AI 未能生成有效的名字，请重试" },
        { status: 500 }
      );
    }

    return NextResponse.json({ names });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "生成失败，请检查 API 配置" },
      { status: 500 }
    );
  }
}
