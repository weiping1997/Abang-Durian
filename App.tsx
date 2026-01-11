
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StallCard from './components/StallCard';
import PriceComparisonTable from './components/PriceComparisonTable';
import DurianAgent from './components/DurianAgent';
import Globe from './components/Globe';
import { MOCK_STALLS } from './constants';
import { Stall, GlobeDestination, WeatherData, Coordinates } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'explore' | 'compare' | 'agent' | 'admin'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Haversine formula to calculate distance in KM
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
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
        alert("Unable to retrieve your location. Showing all stalls instead.");
        setIsLocating(false);
      }
    );
  };

  // Map stalls to Globe destinations
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

  // Mock weather data based on selection
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

    // Filter by search query
    let filtered = stallsWithDistance.filter(stall => 
      stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by distance if user is located
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
      {/* UPDATED HERO BANNER */}
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
                <svg className="animate-spin h-10 w-10 text-green-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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
              : "Discover the world's premier durian suppliers. From local SS2 favorites to international exporters in Thailand and Vietnam."
            }
          </p>
          
          <div className="max-w-md mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search global suppliers (Thailand, Raub, SS2...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 outline-none focus:ring-4 focus:ring-yellow-400 shadow-xl border-none text-center"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Decorative background elements */}
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
            {filteredStalls.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
                <p>No stalls found matching your search.</p>
              </div>
            )}
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
              <p className="text-sm text-yellow-800 mb-4">"Boss, looking for international export? I can help you check bulk prices from Thailand and Vietnam too!"</p>
              <div className="text-xs font-bold text-yellow-600 group-hover:translate-x-1 transition-transform">CHAT NOW →</div>
            </div>
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
                  <span className="mr-2">💰</span> Supplier Catalog
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedStall.varieties.map((v, i) => (
                    <div key={i} className={`p-4 rounded-2xl border-2 ${v.availability ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">{v.name}</span>
                        {v.availability ? (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">In Stock</span>
                        ) : (
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">Check Availability</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-2xl font-black text-green-700">RM{v.pricePerKg}</span>
                        <span className="text-gray-500 text-sm ml-1">/kg (Est.)</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Market Value {v.lastUpdated}</p>
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
                  <span className="mr-2">💬</span> Inquire with Supplier
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 sm:hidden z-40">
        <div className="flex gap-4">
          <button onClick={() => setView('explore')} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm">Explore</button>
          <button onClick={() => setView('agent')} className="flex-1 py-3 bg-yellow-400 text-green-900 rounded-xl font-bold text-sm">Ask Abang</button>
        </div>
      </div>
    </div>
  );
};

export default App;
