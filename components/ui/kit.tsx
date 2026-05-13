"use client";

import Link from "next/link";
import { Bot, Loader2, Mic, Send } from "lucide-react";
import { useState } from "react";

export const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}>{children}</div>
);

export const NeonButton = ({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-semibold text-slate-900 shadow-neon ${className}`}
  >
    {children}
  </button>
);

export const RoleBadge = ({ role }: { role: string }) => (
  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs capitalize text-cyan-200">{role}</span>
);

export const StatusChip = ({ status }: { status: string }) => (
  <span className="rounded-lg border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-xs text-violet-200">{status}</span>
);

export const LoadingSkeleton = () => <Loader2 className="animate-spin text-cyan-300" />;
export const EmptyState = ({ text = "No data" }: { text?: string }) => <div className="py-10 text-center text-slate-400">{text}</div>;
export const ErrorState = ({ text = "Something went wrong" }: { text?: string }) => <div className="py-10 text-center text-rose-400">{text}</div>;

export function OrderCard({ order }: { order: any }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{order.cargo_name || "Cargo"}</p>
        <StatusChip status={order.status || "pending"} />
      </div>
      <p className="mt-2 text-sm text-slate-400">{order.price ? `${order.price} ${order.currency || ""}` : "No price"}</p>
    </GlassCard>
  );
}

export const OfferCard = ({ offer }: { offer: any }) => <GlassCard className="p-4 text-sm">{JSON.stringify(offer)}</GlassCard>;
export const DriverAnnouncementCard = ({ item }: { item: any }) => <GlassCard className="p-4 text-sm">{JSON.stringify(item)}</GlassCard>;
export const RouteTimeline = () => <GlassCard className="p-4 text-sm">Route timeline</GlassCard>;
export const MapPreview = () => <GlassCard className="h-52 p-4 text-sm">Map preview</GlassCard>;

export function AIOrbButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="fixed bottom-20 right-4 z-50 rounded-full border border-cyan-300/20 bg-cyan-400/20 p-4 shadow-neon">
      <Bot className="text-cyan-200" />
    </button>
  );
}

export function VoiceRecorder({ onRecorded }: { onRecorded: (audioB64: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={() => {
        setBusy(true);
        setTimeout(() => {
          onRecorded("dGVzdA==");
          setBusy(false);
        }, 700);
      }}
      className="rounded-full border border-violet-300/30 bg-violet-400/20 p-3"
    >
      {busy ? <LoadingSkeleton /> : <Mic size={18} />}
    </button>
  );
}

export const ChatBubble = ({ text, mine = false }: { text: string; mine?: boolean }) => (
  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${mine ? "ml-auto bg-cyan-400/20" : "bg-white/10"}`}>{text}</div>
);

export function AIChatPanel({
  open,
  messages,
  onSend,
  onVoice,
}: {
  open: boolean;
  messages: Array<{ content?: string; message?: string }>;
  onSend: (text: string) => void;
  onVoice: (audio: string) => void;
}) {
  const [text, setText] = useState("");
  if (!open) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl border border-white/10 bg-slate-950/95 p-4 backdrop-blur-xl">
      <div className="max-h-56 space-y-2 overflow-auto pb-3">
        {messages.map((m, i) => (
          <ChatBubble key={i} text={m.content || m.message || ""} mine={i % 2 === 0} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 rounded-xl bg-white/10 p-2 text-sm" placeholder="Xabar yozing..." />
        <VoiceRecorder onRecorded={onVoice} />
        <button onClick={() => onSend(text)} className="rounded-xl bg-cyan-400 p-2 text-slate-950">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export const AdminStatsCard = ({ title, value }: { title: string; value: string | number }) => (
  <GlassCard className="p-4">
    <p className="text-xs text-slate-400">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </GlassCard>
);

export function DataTable({ rows }: { rows: any[] }) {
  return (
    <GlassCard className="overflow-auto p-3">
      <pre className="text-xs text-slate-300">{JSON.stringify(rows, null, 2)}</pre>
    </GlassCard>
  );
}

export function BottomNav({ role }: { role: "sender" | "driver" }) {
  const items =
    role === "sender"
      ? [
          { href: "/sender/dashboard", label: "Dashboard" },
          { href: "/sender/orders", label: "Orders" },
          { href: "/sender/chat", label: "Chat" },
        ]
      : [
          { href: "/driver/dashboard", label: "Dashboard" },
          { href: "/driver/orders", label: "Orders" },
          { href: "/driver/chat", label: "Chat" },
        ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-3 border-t border-white/10 bg-slate-950/95 p-2 backdrop-blur-xl">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="rounded-lg px-3 py-2 text-center text-xs text-slate-300">
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileHeader({ title }: { title: string }) {
  return <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 p-4 text-sm font-semibold backdrop-blur">{title}</header>;
}
