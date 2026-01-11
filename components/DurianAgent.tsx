
import React, { useState, useRef, useEffect } from 'react';
import { createDurianAgent } from '../services/geminiService';
import { ChatMessage } from '../types';
// Added Chat import to fix "Cannot find name 'Chat'" error
import { Chat } from '@google/genai';

const DurianAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello Boss! Abang Durian here. Looking for the best Musang King or want me to check today's prices in SS2? Just ask, I can search the whole web for you! 👑",
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
      
      const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '#'
      })).filter((item: any) => item.uri !== '#');

      const modelMsg: ChatMessage = {
        role: 'model',
        text: response.text || "Sorry boss, my line is a bit shaky. Can you repeat that?",
        timestamp: new Date(),
        groundingUrls: urls
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Adoi! Something went wrong while I was searching. Let's try again?",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 durian-gradient text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-green-900 font-bold text-xl">
            👨‍🌾
          </div>
          <div>
            <h2 className="font-bold leading-none">Abang Durian AI</h2>
            <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online • Expert Concierge</span>
          </div>
        </div>
        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
          Powered by Gemini 3 Pro
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>
              
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">Sources Found:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.slice(0, 3).map((url, i) => (
                      <a 
                        key={i} 
                        href={url.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 text-green-700 px-2 py-1 rounded transition-colors truncate max-w-[150px]"
                      >
                        🔗 {url.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={`text-[9px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-200"></div>
              <span className="text-xs text-gray-400 font-medium ml-2">Abang is searching...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Abang: 'Find Musang King prices in Raub' or 'Difference between XO and D24?'"
            className="flex-grow p-4 bg-gray-100 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isTyping}
            className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-all disabled:bg-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DurianAgent;
