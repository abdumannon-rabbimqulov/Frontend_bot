"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";

type WsEvent =
  | { type: "new_message"; content: string }
  | { type: "voice_transcribed"; content: string }
  | { type: "ai_action"; action: string }
  | { type: "ai_limit_exceeded"; message: string }
  | { type: "error"; message: string };

export function useAIWebSocket(chatId: number | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<WsEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    if (!chatId || !accessToken) return;
    const wsBase = process.env.NEXT_PUBLIC_WS_URL || "wss://logistic.org.uz";
    const ws = new WebSocket(`${wsBase}/ai/ws/${chatId}?token=${accessToken}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        setMessages((prev) => [...prev, payload]);
      } catch {
        setMessages((prev) => [...prev, { type: "error", message: "Invalid websocket payload" }]);
      }
    };
    return () => ws.close();
  }, [chatId, accessToken]);

  const sendText = (content: string) => {
    wsRef.current?.send(JSON.stringify({ type: "new_message", content, sender_id: user?.id }));
  };

  const sendVoice = (audio_b64: string, mime_type = "audio/webm") => {
    wsRef.current?.send(JSON.stringify({ type: "voice_message", audio_b64, mime_type, sender_id: user?.id }));
  };

  return { connected, messages, sendText, sendVoice };
}
