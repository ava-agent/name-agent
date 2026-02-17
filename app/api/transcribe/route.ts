import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "没有收到音频文件" }, { status: 400 });
    }

    // 将 File 转为 Blob，确保智谱 API 能正确接收
    const arrayBuffer = await audioFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: audioFile.type || "audio/webm" });

    // 构建发给智谱 GLM-ASR 的请求
    const zhipuForm = new FormData();
    zhipuForm.append("model", "glm-asr");
    zhipuForm.append("file", blob, audioFile.name || "recording.webm");

    const response = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
        },
        body: zhipuForm,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("GLM-ASR error:", response.status, errText);
      return NextResponse.json(
        { error: "语音识别失败，请重试" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("GLM-ASR response:", JSON.stringify(data));

    // 尝试多种可能的返回格式
    let text = "";
    if (typeof data.text === "string") {
      text = data.text;
    } else if (data.choices?.[0]?.message?.content) {
      text = data.choices[0].message.content;
    } else if (data.result) {
      text = data.result;
    }

    if (!text) {
      return NextResponse.json({ error: "未能识别语音内容" });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Transcribe error:", error);
    return NextResponse.json(
      { error: "服务器错误，请重试" },
      { status: 500 }
    );
  }
}
