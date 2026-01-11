
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StallCard from './components/StallCard';
import PriceComparisonTable from './components/PriceComparisonTable';
import DurianAgent from './components/DurianAgent';
import { MOCK_STALLS } from './constants';
import { Stall } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'explore' | 'compare' | 'agent' | 'admin'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredStalls = useMemo(() => {
    return MOCK_STALLS.filter(stall => 
      stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderExplore = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="durian-gradient rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">Find the Freshest Durians in Malaysia</h2>
          <p className="text-green-50 text-lg opacity-90 mb-8">Real-time price comparison and stall finder for Musang King, Black Thorn, and more.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search by area (SS2, Raub, Bentong...)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 outline-none focus:ring-2 focus:ring-yellow-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-300 text-green-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-black/10">
              Find Nearby
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-400 opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-gray-900">Featured Stalls ({filteredStalls.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredStalls.map(stall => (
              <StallCard key={stall.id} stall={stall} onSelect={setSelectedStall} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div 
            onClick={() => setView('agent')}
            className="bg-yellow-100 p-6 rounded-3xl shadow-sm border border-yellow-200 cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-3xl">👨‍🌾</span>
              <h4 className="font-bold text-yellow-900">Ask Abang Durian</h4>
            </div>
            <p className="text-sm text-yellow-800 mb-4">"Boss, I can find the best prices for you online right now! Just ask."</p>
            <div className="text-xs font-bold text-yellow-600 group-hover:translate-x-1 transition-transform">CHAT NOW →</div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔔</span> Price Alerts
            </h4>
            <p className="text-sm text-gray-500 mb-4">Get notified when Musang King drops below RM60/kg in Petaling Jaya.</p>
            <button className="w-full py-3 rounded-xl border-2 border-green-600 text-green-600 font-bold hover:bg-green-50 transition-colors">
              Set Price Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading Malaysia's finest...</p>
        </div>
      );
    }

    switch (view) {
      case 'compare': return <PriceComparisonTable stalls={MOCK_STALLS} />;
      case 'agent': return <DurianAgent />;
      default: return renderExplore();
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar onNav={setView} activeView={view} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {selectedStall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStall(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedStall(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-900 shadow-sm hover:bg-white"
            >
              ✕
            </button>
            <div className="h-64 sm:h-80 relative">
              <img src={selectedStall.photos[0]} alt={selectedStall.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-black">{selectedStall.name}</h2>
                <p className="opacity-90 mt-1 flex items-center">
                  <span className="mr-2">📍</span> {selectedStall.address}
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">💰</span> Today's Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedStall.varieties.map((v, i) => (
                    <div key={i} className={`p-4 rounded-2xl border-2 ${v.availability ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">{v.name}</span>
                        {v.availability ? (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">In Stock</span>
                        ) : (
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">Out of Stock</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-2xl font-black text-green-700">RM{v.pricePerKg}</span>
                        <span className="text-gray-500 text-sm ml-1">/kg</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Updated {v.lastUpdated}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`https://wa.me/${selectedStall.whatsapp}`}
                  target="_blank"
                  className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold text-center hover:bg-green-700 transition-all flex items-center justify-center"
                >
                  <span className="mr-2">💬</span> WhatsApp Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 sm:hidden z-40">
        <div className="flex gap-4">
          <button onClick={() => setView('explore')} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm">Nearby</button>
          <button onClick={() => setView('agent')} className="flex-1 py-3 bg-yellow-400 text-green-900 rounded-xl font-bold text-sm">Ask Abang</button>
        </div>
      </div>
    </div>
  );
};

export default App;
