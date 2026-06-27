import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "语音识别暂未启用：旧语音服务已下线，需接入火山引擎语音识别后恢复。",
    },
    { status: 501 }
  );
}
