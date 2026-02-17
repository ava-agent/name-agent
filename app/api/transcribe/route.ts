import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "没有收到音频文件" }, { status: 400 });
    }

    // 构建发给智谱 GLM-ASR 的请求
    const zhipuForm = new FormData();
    zhipuForm.append("model", "glm-asr");
    zhipuForm.append("file", audioFile, "recording.webm");

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

    // GLM-ASR 返回格式：{ text: "识别结果" }
    const text = data.text || "";

    if (!text) {
      return NextResponse.json(
        { error: "未能识别语音内容" },
        { status: 200 }
      );
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
