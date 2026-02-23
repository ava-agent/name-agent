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
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  // 在客户端检测支持情况
  useEffect(() => {
    setSupported(
      !!navigator.mediaDevices?.getUserMedia && !!window.MediaRecorder
    );
  }, []);

  // 组件卸载时清理所有资源
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // 停止录音
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      // 清理所有 setTimeout
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  // 安全的 setTimeout，自动追踪以便清理
  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      if (mountedRef.current) fn();
    }, ms);
    timersRef.current.push(id);
    return id;
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
    // 防止重复启动录音
    if (mediaRecorderRef.current?.state === "recording") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 如果在获取权限期间组件已卸载，立即释放
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

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

        // 组件已卸载则不处理
        if (!mountedRef.current) return;

        const actualType = mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: actualType });
        if (audioBlob.size < 100) {
          setIsProcessing(false);
          return;
        }

        setIsProcessing(true);
        setTranscript("识别中...");

        try {
          const formData = new FormData();
          const ext = actualType.includes("mp4")
            ? "mp4"
            : actualType.includes("ogg")
              ? "ogg"
              : actualType.includes("wav")
                ? "wav"
                : "webm";
          formData.append("audio", audioBlob, `recording.${ext}`);

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!mountedRef.current) return;

          const data = await res.json();
          if (data.text) {
            setTranscript(data.text);
            onResultRef.current?.(data.text);
          } else {
            setTranscript(data.error || "未识别到内容");
            safeTimeout(() => setTranscript(""), 3000);
          }
        } catch {
          if (!mountedRef.current) return;
          setTranscript("网络错误");
          safeTimeout(() => setTranscript(""), 3000);
        } finally {
          if (mountedRef.current) setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
      setTranscript("");
    } catch {
      if (!mountedRef.current) return;
      setTranscript("无法访问麦克风");
      safeTimeout(() => setTranscript(""), 3000);
    }
  }, [getMimeType, safeTimeout]);

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
