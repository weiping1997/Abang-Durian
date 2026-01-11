
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.tsx';
import StallCard from './components/StallCard.tsx';
import PriceComparisonTable from './components/PriceComparisonTable.tsx';
import DurianAgent from './components/DurianAgent.tsx';
import Globe from './components/Globe.tsx';
import { MOCK_STALLS } from './constants.tsx';
import { Stall, GlobeDestination, WeatherData, Coordinates } from './types.ts';

const App: React.FC = () => {
  const [view, setView] = useState<'explore' | 'compare' | 'agent' | 'admin'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve your location. Showing all global suppliers.");
        setIsLocating(false);
      }
    );
  };

  const globeDestinations: GlobeDestination[] = useMemo(() => {
    return MOCK_STALLS.map(stall => ({
      id: stall.id,
      name: stall.name,
      country: stall.address.split(',').pop()?.trim() || "Malaysia",
      coordinates: [stall.coordinates.lng, stall.coordinates.lat],
      poeticTitle: `Source: ${stall.name}`,
      description: stall.address,
      image: stall.photos[0],
      visitedAt: "Today"
    }));
  }, []);

  const activeWeather: WeatherData | null = useMemo(() => {
    if (!selectedStall) return null;
    return {
      temp: 31,
      condition: "Tropical Sun",
      humidity: 80,
      windSpeed: 12
    };
  }, [selectedStall]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredStalls = useMemo(() => {
    let stallsWithDistance = MOCK_STALLS.map(stall => {
      if (userCoords) {
        const dist = calculateDistance(
          userCoords.lat, userCoords.lng,
          stall.coordinates.lat, stall.coordinates.lng
        );
        return { ...stall, distance: Math.round(dist * 10) / 10 };
      }
      return stall;
    });

    let filtered = stallsWithDistance.filter(stall => 
      stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (userCoords) {
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return filtered;
  }, [searchQuery, userCoords]);

  const handleGlobeSelect = (dest: GlobeDestination) => {
    const stall = MOCK_STALLS.find(s => s.id === dest.id);
    if (stall) setSelectedStall(stall);
  };

  const renderExplore = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="durian-gradient rounded-[3rem] p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        <div className="relative z-10 max-w-3xl">
          <button 
            onClick={handleLocateMe}
            disabled={isLocating}
            className="group relative mb-8 outline-none focus:ring-4 focus:ring-yellow-400/50 rounded-full transition-all"
          >
            <div className={`absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/40 transition-all ${isLocating ? 'animate-pulse' : ''}`}></div>
            <div className={`relative w-24 h-24 sm:w-32 sm:h-32 bg-yellow-400 rounded-full flex items-center justify-center text-green-900 shadow-2xl border-4 border-white/20 transition-transform active:scale-90 ${isLocating ? 'animate-spin' : 'hover:scale-110'}`}>
              {isLocating ? (
                <span className="text-4xl animate-spin">🌀</span>
              ) : (
                <span className="text-5xl sm:text-6xl">🌍</span>
              )}
            </div>
            {!isLocating && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-green-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                Click to Locate
              </div>
            )}
          </button>

          <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-tight tracking-tight">
            Find me Durian
          </h2>
          <p className="text-green-50 text-lg opacity-80 mb-10 max-w-xl mx-auto">
            {userCoords 
              ? `Showing ${filteredStalls.length} suppliers across the globe. Closest matches prioritizing local suppliers.` 
              : "Discover verified global durian suppliers. Real-time pricing from SS2 to Chanthaburi and Davao."
            }
          </p>
          
          <div className="max-w-md mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search global suppliers (Thailand, Vietnam, SS2...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 outline-none focus:ring-4 focus:ring-yellow-400 shadow-xl border-none text-center"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-400 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-gray-900">
              {userCoords ? "Closest Suppliers" : "Verified Global Suppliers"} ({filteredStalls.length})
            </h3>
            {userCoords && (
              <button 
                onClick={() => setUserCoords(null)}
                className="text-xs text-green-600 font-bold uppercase tracking-widest hover:underline"
              >
                Reset Location
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredStalls.map(stall => (
              <StallCard 
                key={stall.id} 
                stall={stall} 
                onSelect={(s) => setSelectedStall(s)} 
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <Globe 
              destinations={globeDestinations}
              onSelectDestination={handleGlobeSelect}
              activeId={selectedStall?.id}
              weather={activeWeather}
            />
            <div 
              onClick={() => setView('agent')}
              className="bg-yellow-100 p-6 rounded-3xl shadow-sm border border-yellow-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">👨‍🌾</span>
                <h4 className="font-bold text-yellow-900">Ask Abang Durian</h4>
              </div>
              <p className="text-sm text-yellow-800 mb-4">"Boss, need help with import? I can check bulk prices from global sources too!"</p>
              <div className="text-xs font-bold text-yellow-600 group-hover:translate-x-1 transition-transform">CHAT NOW →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return null;
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStall(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <button onClick={() => setSelectedStall(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">✕</button>
            <div className="h-64 relative">
              <img src={selectedStall.photos[0]} className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 text-white"><h2 className="text-3xl font-black">{selectedStall.name}</h2></div>
            </div>
            <div className="p-8 space-y-6">
              <h3 className="font-bold text-gray-900">Catalog</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedStall.varieties.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="font-bold">{v.name}</p>
                    <p className="text-xl font-black text-green-700">RM{v.pricePerKg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
