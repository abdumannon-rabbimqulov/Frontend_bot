"use client";

import { useState } from "react";
import { AIOrbButton, AIChatPanel, BottomNav, MobileHeader } from "@/components/ui/kit";
import { useAIWebSocket } from "@/hooks/use-ai-websocket";

export function AppShell({
  title,
  role,
  children,
  chatId = 1,
}: {
  title: string;
  role: "sender" | "driver";
  children: React.ReactNode;
  chatId?: number;
}) {
  const [open, setOpen] = useState(false);
  const { messages, sendText, sendVoice } = useAIWebSocket(chatId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#050a1f] to-[#020617] pb-24 text-white">
      <MobileHeader title={title} />
      <main className="p-4">{children}</main>
      <AIOrbButton onClick={() => setOpen((v) => !v)} />
      <AIChatPanel open={open} messages={messages as any} onSend={sendText} onVoice={sendVoice} />
      <BottomNav role={role} />
    </div>
  );
}
