
import React, { useState, useRef, useEffect } from 'react';
import { createDurianAgent } from '../services/geminiService.ts';
import { ChatMessage } from '../types.ts';
import { Chat } from '@google/genai';

const DurianAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello Boss! Abang Durian here. Looking for the best Musang King or want me to check global prices? Just ask! 🌍",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = createDurianAgent();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const response = await chatRef.current!.sendMessage({ message: userMsg.text });
      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text || "Sorry boss, my line is a bit shaky.",
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Something went wrong boss!", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[60vh] flex flex-col bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-4 durian-gradient text-white flex items-center justify-between font-bold">Abang Durian AI</div>
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white border border-gray-100 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="p-4 border-t border-gray-100 flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&handleSend()} className="flex-grow p-4 bg-gray-100 rounded-xl outline-none" placeholder="Ask anything..." />
        <button onClick={handleSend} className="bg-green-600 text-white px-6 rounded-xl">Send</button>
      </div>
    </div>
  );
};

export default DurianAgent;
