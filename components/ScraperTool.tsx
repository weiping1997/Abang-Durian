
import React, { useState } from 'react';
import { extractStallDataFromText } from '../services/geminiService';

const ScraperTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScrape = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const data = await extractStallDataFromText(inputText);
      setResult(data);
    } catch (err) {
      alert("Failed to extract data. Check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 mb-2">AI Durian Price Extractor</h2>
        <p className="text-gray-500 mb-8">Paste a Facebook post or seller announcement text below. Our AI will automatically parse the prices and varieties for you.</p>
        
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Example: "Today's Promotion at SS2 Durian King! 
Musang King D197 only RM65/kg. Black Thorn RM95/kg. 
Limited stock, call 012-3456789 to book!"`}
            className="w-full h-40 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
          />
          <button
            onClick={handleScrape}
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
            }`}
          >
            {isLoading ? 'Processing with Gemini...' : 'Analyze Text'}
          </button>
        </div>

        {result && (
          <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Extracted Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold">STALL NAME</p>
                <p className="text-lg font-bold text-gray-900">{result.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold">WHATSAPP</p>
                <p className="text-lg font-bold text-gray-900">{result.whatsapp || 'Not found'}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-gray-400 font-bold mb-2">PRICING FOUND</p>
              <div className="space-y-2">
                {result.varieties?.map((v: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="font-bold text-green-900">{v.name}</span>
                    <span className="font-black text-green-700">RM {v.pricePerKg} / kg</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                Apply to Database
              </button>
              <button onClick={() => setResult(null)} className="px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50">
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl">
        <h4 className="text-yellow-800 font-bold mb-2">How it works</h4>
        <ul className="text-yellow-700 text-sm space-y-2 list-disc pl-5">
          <li>Uses Google's Gemini Flash model for high-speed Natural Language Processing.</li>
          <li>Automatically identifies Malaysian durian varieties (D197, D200, etc.).</li>
          <li>Sanitizes contact numbers and address data for platform consistency.</li>
          <li>Prevents manual entry errors for seasonal price updates.</li>
        </ul>
      </div>
    </div>
  );
};

export default ScraperTool;
