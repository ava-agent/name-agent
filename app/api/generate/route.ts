import { NextRequest, NextResponse } from "next/server";
import { getAIClient } from "@/lib/ai/client";
import { buildPrompt } from "@/lib/ai/prompt";
import { UserContext, GeneratedName } from "@/lib/types";

// Allow up to 60s for AI generation
export const maxDuration = 60;

function extractJsonArray(content: string): unknown[] | null {
  // Strategy 1: Try parsing the entire content as JSON
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not pure JSON, try extraction
  }

  // Strategy 2: Extract from markdown code block ```json ... ```
  const codeBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // continue to next strategy
    }
  }

  // Strategy 3: Greedy match for JSON array [ ... ]
  const greedyMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (greedyMatch) {
    try {
      const parsed = JSON.parse(greedyMatch[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // continue
    }
  }

  return null;
}

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
    const timeout = setTimeout(() => controller.abort(), 55000);

    let response;
    try {
      response = await client.chat.completions.create(
        {
          model: "glm-4-flash",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        },
        { signal: controller.signal }
      );
    } finally {
      clearTimeout(timeout);
    }

    const content = response.choices[0]?.message?.content || "";

    if (!content) {
      console.error("AI returned empty content");
      return NextResponse.json(
        { error: "AI 返回为空，请重试" },
        { status: 500 }
      );
    }

    // 从返回内容中提取 JSON
    let names: GeneratedName[] = [];
    const raw = extractJsonArray(content);

    if (raw) {
      names = raw
        .filter(
          (item: unknown): item is Record<string, unknown> =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as Record<string, unknown>).givenName === "string" &&
            !!(item as Record<string, unknown>).givenName
        )
        .map((item, index) => ({
          id: `name-${Date.now()}-${index}`,
          surname: context.surname || "",
          givenName: String(item.givenName),
          pinyin: String(item.pinyin || ""),
          meaning: String(item.meaning || "暂无解释"),
          source: String(item.source || "原创"),
          wuxingAnalysis: String(item.wuxingAnalysis || "暂无分析"),
          personalConnection: String(item.personalConnection || ""),
        }));
    } else {
      console.error(
        "Failed to extract JSON from AI response. Content preview:",
        content.slice(0, 500)
      );
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
