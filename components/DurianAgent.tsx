
import React, { useState, useRef, useEffect } from 'react';
import { createDurianAgent } from '../services/geminiService.ts';
import { ChatMessage } from '../types.ts';
import { Chat, GenerateContentResponse } from '@google/genai';
import { ExternalLink, Search, Info } from 'lucide-react';

const DurianAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello Boss! Abang Durian here. I'm connected to the Global Market (Tridge). Want me to check global suppliers or find specific products from the web? 🌍",
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

  const handleSend = async (forcedPrompt?: string) => {
    const textToSend = forcedPrompt || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response: GenerateContentResponse = await chatRef.current!.sendMessage({ message: userMsg.text });
      
      // Extract grounding metadata if available
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const urls: { title: string; uri: string }[] = [];
      
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            urls.push({ title: chunk.web.title, uri: chunk.web.uri });
          }
        });
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text || "Sorry boss, my line is a bit shaky.",
        timestamp: new Date(),
        groundingUrls: urls.length > 0 ? urls : undefined
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Something went wrong boss! Maybe my data connection to the market is cut.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-5 durian-gradient text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">👨‍🌾</div>
          <div>
            <h2 className="font-black text-lg">Abang Durian AI</h2>
            <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Global Market Scout Active</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] p-5 shadow-sm ${msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
              <p className="leading-relaxed">{msg.text}</p>
              
              {msg.groundingUrls && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Search className="w-3 h-3" /> Verified Market Sources:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full hover:bg-green-100 transition-colors border border-green-100"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.title.length > 25 ? link.title.substring(0, 25) + '...' : link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-400 mt-2 font-bold px-2">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-400 px-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Scanning Global Market...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Actions */}
      <div className="px-6 py-3 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => handleSend("List global durian suppliers from Tridge and their countries.")}
          className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-green-100 text-slate-700 hover:text-green-700 text-xs font-bold rounded-xl transition-all border border-slate-200"
        >
          🌐 List Global Suppliers
        </button>
        <button 
          onClick={() => handleSend("Find Musang King prices in Malaysia today.")}
          className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-green-100 text-slate-700 hover:text-green-700 text-xs font-bold rounded-xl transition-all border border-slate-200"
        >
          💰 Today's MK Prices
        </button>
        <button 
          onClick={() => handleSend("Tell me about Black Thorn availability.")}
          className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-green-100 text-slate-700 hover:text-green-700 text-xs font-bold rounded-xl transition-all border border-slate-200"
        >
          🌑 Black Thorn Info
        </button>
      </div>

      <div className="p-4 bg-white flex gap-3 items-center">
        <input 
          value={input} 
          onChange={(e)=>setInput(e.target.value)} 
          onKeyPress={(e)=>e.key==='Enter'&&handleSend()} 
          className="flex-grow p-4 bg-gray-100 rounded-2xl outline-none text-gray-800 placeholder:text-gray-400 font-medium" 
          placeholder="Ask Abang anything about the market..." 
        />
        <button 
          onClick={() => handleSend()} 
          disabled={isTyping}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default DurianAgent;
