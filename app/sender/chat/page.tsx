"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard, LoadingSkeleton } from "@/components/ui/kit";
import { senderApi } from "@/lib/api/endpoints";

export default function SenderChatPage() {
  const { data, isLoading } = useQuery({ queryKey: ["sender-chats"], queryFn: senderApi.chats });
  return (
    <AppShell role="sender" title="Sender Chat">
      {isLoading && <LoadingSkeleton />}
      <div className="space-y-3">
        {data?.map((chat: any) => (
          <GlassCard key={chat.id} className="p-4">
            <p className="font-semibold">{chat.title || `Chat #${chat.id}`}</p>
            <p className="text-xs text-slate-400">{chat.status}</p>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
