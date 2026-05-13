import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DriverLayout from '../components/DriverLayout';
import { ai } from '../lib/api';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const { data: chats = [] } = useQuery({
    queryKey: ['aiChats'],
    queryFn: ai.chats,
  });
  const { data: wsInfo } = useQuery({
    queryKey: ['aiWsInfo'],
    queryFn: ai.wsInfo,
  });
  const currentChat = useMemo(() => chats[0], [chats]);

  useEffect(() => {
    async function ensureChat() {
      if (currentChat?.id) {
        setChatId(currentChat.id);
        return;
      }
      try {
        const created = await ai.createChat({ title: 'Driver assistant', category: 'conversation' });
        setChatId(created?.id || null);
      } catch {
        setChatId(null);
      }
    }
    ensureChat();
  }, [currentChat?.id]);

  useEffect(() => {
    if (!chatId) return;
    const wsUrl = wsInfo?.ws_url || wsInfo?.url;
    if (!wsUrl) return;

    const socket = new WebSocket(`${wsUrl}?chat_id=${chatId}`);
    socketRef.current = socket;
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data?.content) return;
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}_${Math.random()}`, from: data.sender_type === 'driver' ? 'user' : 'ai', text: data.content, time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) },
        ]);
      } catch {
        // ignore broken payload
      }
    };

    return () => {
      socket.close();
    };
  }, [chatId, wsInfo?.ws_url, wsInfo?.url]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ chat_id: chatId, content: text }));
    }
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}_self`, from: 'user', text, time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <DriverLayout>
      <div className="flex flex-col h-[calc(100dvh-5rem)] px-4 pt-4">
        <div className="mb-3">
          <div className="font-bold">AI Agent</div>
          <div className="text-xs text-muted">Yuk haqida so‘rang yoki taklif bering</div>
        </div>

        <div className="flex-1 overflow-auto space-y-3 pb-24">
          {messages.length === 0 && (
            <div className="panel p-4 text-sm text-muted">
              Chat hozircha bo‘sh. Demo yozishmalar olib tashlandi.
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : ''}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.from === 'user' ? 'bg-primary text-bg' : 'bg-card border border-border'}`}>
                {m.text}
                <div className="text-[10px] text-right opacity-60 mt-0.5">{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-0 flex gap-2 bg-bg pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => bottomRef.current?.scrollIntoView({ block: 'end' })}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'NumpadEnter') send();
            }}
            placeholder="Xabar yozing..."
            className="input flex-1"
          />
          <button onClick={send} className="btn-primary px-5">Yubor</button>
        </div>
      </div>
    </DriverLayout>
  );
}
