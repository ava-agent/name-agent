"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void;
}

export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const { onResult } = options;
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 在客户端检测支持情况
  useEffect(() => {
    setSupported(
      !!navigator.mediaDevices?.getUserMedia && !!window.MediaRecorder
    );
  }, []);

  // 获取浏览器支持的音频格式
  const getMimeType = useCallback(() => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "";
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getMimeType();
      const recorderOptions = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());

        const audioBlob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        if (audioBlob.size < 100) {
          setIsProcessing(false);
          return;
        }

        setIsProcessing(true);
        setTranscript("识别中...");

        try {
          const formData = new FormData();
          // 根据 mime 类型选择扩展名
          const ext = mimeType.includes("mp4")
            ? "mp4"
            : mimeType.includes("ogg")
              ? "ogg"
              : mimeType.includes("wav")
                ? "wav"
                : "webm";
          formData.append("audio", audioBlob, `recording.${ext}`);

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (data.text) {
            setTranscript(data.text);
            onResultRef.current?.(data.text);
          } else {
            setTranscript(data.error || "未识别到内容");
            // 3秒后清除错误提示
            setTimeout(() => setTranscript(""), 3000);
          }
        } catch {
          setTranscript("网络错误");
          setTimeout(() => setTranscript(""), 3000);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
      setTranscript("");
    } catch {
      setTranscript("无法访问麦克风");
      setTimeout(() => setTranscript(""), 3000);
    }
  }, [getMimeType]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return {
    isListening,
    isProcessing,
    supported,
    transcript,
    toggle,
    start,
    stop,
  };
}
