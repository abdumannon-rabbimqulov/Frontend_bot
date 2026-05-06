import { useState } from 'react';
import DriverLayout from '../components/DriverLayout';

const initialMessages = [
  { id: 1, from: 'ai', text: 'Salom! Bugun qanday yuklar qiziqtiryapti?', time: '14:05' },
  { id: 2, from: 'user', text: 'Toshkentdan Buxoroga 20t yuk kerak', time: '14:06' },
  { id: 3, from: 'ai', text: 'Topildi! 3 ta variant bor. Eng yaxshisi 4.35 mln so‘m.', time: '14:07' },
];

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), from: 'user', text: input.trim(), time: 'Hozir' };
    setMessages([...messages, newMsg]);
    setInput('');

    // Simulate AI reply
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now()+1, from: 'ai', text: 'Tushundim. Taklif berishni xohlaysizmi?', time: 'Hozir' }]);
    }, 900);
  };

  return (
    <DriverLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)] px-4 pt-4">
        <div className="mb-3">
          <div className="font-bold">AI Agent</div>
          <div className="text-xs text-muted">Yuk haqida so‘rang yoki taklif bering</div>
        </div>

        <div className="flex-1 overflow-auto space-y-3 pb-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : ''}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.from === 'user' ? 'bg-primary text-bg' : 'bg-card border border-border'}`}>
                {m.text}
                <div className="text-[10px] text-right opacity-60 mt-0.5">{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 flex gap-2 bg-bg pt-2 pb-4">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Yozing yoki ovozli xabar yuboring..." className="input flex-1" />
          <button onClick={send} className="btn-primary px-5">Yubor</button>
        </div>
      </div>
    </DriverLayout>
  );
}
