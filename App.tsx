
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.tsx';
import StallCard from './components/StallCard.tsx';
import VRViewer from './components/VRViewer.tsx';
import DurianAgent from './components/DurianAgent.tsx';
import Globe from './components/Globe.tsx';
import { MOCK_STALLS } from './constants.tsx';
import { Stall, GlobeDestination, WeatherData, Coordinates } from './types.ts';
import { AlertCircle, Zap, Radio, Map as MapIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'explore' | 'vr' | 'agent' | 'admin'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [filterToCountry, setFilterToCountry] = useState(true);
  const [modalImgSrc, setModalImgSrc] = useState<string>('');

  useEffect(() => {
    if (selectedStall) {
      setModalImgSrc(selectedStall.photos[0]);
    } else {
      setModalImgSrc('');
    }
  }, [selectedStall]);

  const handleModalImageError = () => {
    if (selectedStall) {
      const durianPhotoIds = [
        '1592500305630-419da01a7c33',
        '1593001872102-9993ef9089e0',
        '1627311740925-5f5f4f664539',
        '1627311739266-724239859f7b',
        '1540664866192-9d79560f760a',
        '1592500305149-6a3c9a62624f',
        '1592500305105-0904d601a7c8',
        '1604177093285-0c0b87532f05'
      ];
      const hash = selectedStall.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const photoId = durianPhotoIds[hash % durianPhotoIds.length];
      setModalImgSrc(`https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1200&sig=${selectedStall.id}`);
    }
  };

  const detectedCountry = useMemo(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Kuala_Lumpur')) return 'Malaysia';
    if (tz.includes('Bangkok')) return 'Thailand';
    if (tz.includes('Saigon') || tz.includes('Ho_Chi_Minh')) return 'Vietnam';
    if (tz.includes('Manila')) return 'Philippines';
    if (tz.includes('Jakarta')) return 'Indonesia';
    if (tz.includes('Singapore')) return 'Singapore';
    return null;
  }, []);

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
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setIsLocating(false);
        const stallsWithDist = MOCK_STALLS.map(s => ({
          ...s,
          dist: calculateDistance(coords.lat, coords.lng, s.coordinates.lat, s.coordinates.lng)
        })).sort((a, b) => a.dist - b.dist);
        if (stallsWithDist.length > 0) setSelectedStall(stallsWithDist[0]);
      },
      () => {
        alert("Unable to retrieve your location. Showing global suppliers.");
        setIsLocating(false);
      }
    );
  };

  const globeDestinations: GlobeDestination[] = useMemo(() => {
    return MOCK_STALLS.map(stall => {
      const bestPrice = stall.varieties.find(v => v.name.includes('Musang King') || v.name.includes('Monthong')) || stall.varieties[0];
      return {
        id: stall.id,
        name: stall.name,
        country: stall.address.split(',').pop()?.trim() || "Malaysia",
        coordinates: [stall.coordinates.lng, stall.coordinates.lat],
        poeticTitle: `Source: ${stall.name}`,
        description: stall.address,
        image: stall.photos[0],
        visitedAt: "Today",
        priceLabel: bestPrice ? `RM${bestPrice.pricePerKg}` : undefined
      };
    });
  }, []);

  const activeWeather: WeatherData | null = useMemo(() => {
    if (!selectedStall) return null;
    return { temp: 31, condition: "Tropical Sun", humidity: 80, windSpeed: 12 };
  }, [selectedStall]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredStalls = useMemo(() => {
    let baseList = MOCK_STALLS.map(stall => {
      if (userCoords) {
        const dist = calculateDistance(userCoords.lat, userCoords.lng, stall.coordinates.lat, stall.coordinates.lng);
        return { ...stall, distance: Math.round(dist * 10) / 10 };
      }
      return stall;
    });
    if (filterToCountry && detectedCountry) {
      baseList = baseList.filter(s => s.address.toLowerCase().includes(detectedCountry.toLowerCase()));
    }
    let filtered = baseList.filter(stall => 
      stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (userCoords) filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    return filtered;
  }, [searchQuery, userCoords, filterToCountry, detectedCountry]);

  const handleGlobeSelect = (dest: GlobeDestination) => {
    const stall = MOCK_STALLS.find(s => s.id === dest.id);
    if (stall) {
      setSelectedStall(stall);
      // Smooth scroll back to listings if selecting from globe
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const renderExplore = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="durian-gradient rounded-[3rem] p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        <div className="relative z-10 max-w-3xl">
          <button onClick={handleLocateMe} disabled={isLocating} className="group relative mb-8 outline-none focus:ring-4 focus:ring-yellow-400/50 rounded-full transition-all">
            <div className={`absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/40 transition-all ${isLocating ? 'animate-pulse' : ''}`}></div>
            <div className={`relative w-24 h-24 sm:w-32 sm:h-32 bg-yellow-400 rounded-full flex items-center justify-center text-green-900 shadow-2xl border-4 border-white/20 transition-transform active:scale-90 ${isLocating ? 'animate-spin' : 'hover:scale-110'}`}>
              {isLocating ? <span className="text-4xl animate-spin">🌀</span> : <span className="text-5xl sm:text-6xl">🌍</span>}
            </div>
            {!isLocating && <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-green-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Click to Locate</div>}
          </button>
          <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-tight tracking-tight">Find me Durian</h2>
          <p className="text-green-50 text-lg opacity-80 mb-10 max-w-xl mx-auto">{detectedCountry ? `Currently showing suppliers in ${detectedCountry}. Found ${filteredStalls.length} matches near you.` : "Discover verified global durian suppliers. Real-time pricing from SS2 to Chanthaburi and Davao."}</p>
          <div className="max-w-md mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Search specific stalls or varieties..." className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 outline-none focus:ring-4 focus:ring-yellow-400 shadow-xl border-none text-center" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{filterToCountry && detectedCountry ? `Best in ${detectedCountry}` : "Global Suppliers"}</h3>
              <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest">{filteredStalls.length} verified listings found</p>
            </div>
            <button onClick={() => setFilterToCountry(!filterToCountry)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filterToCountry ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-100 hover:border-green-600'}`}>{filterToCountry ? "Showing Local Only" : "Show All Global"}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredStalls.map(stall => <StallCard key={stall.id} stall={stall} onSelect={(s) => setSelectedStall(s)} />)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Emergency Broadcast Message */}
            <div className="relative overflow-hidden bg-red-600 rounded-3xl p-6 text-white shadow-xl shadow-red-200 border-2 border-red-500">
              <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                <Radio className="w-24 h-24" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-white text-red-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter animate-bounce flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-red-600" /> LIVE BROADCAST
                </div>
                <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
              </div>
              <h4 className="text-xl font-black leading-tight mb-2">PAHANG HARVEST ALERT</h4>
              <p className="text-xs text-red-50 font-medium leading-relaxed opacity-90">
                Pahang durian season has peaked. Massive supply inflow detected from Raub. Musang King prices projected to drop by <span className="underline font-black">15-20%</span> across Selangor stalls within 48 hours. 
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-red-100 uppercase tracking-widest">
                <AlertCircle className="w-3 h-3" /> Broadcast ID: #PH-9921-X
              </div>
            </div>

            {/* Ask Abang Card */}
            <div onClick={() => setView('agent')} className="bg-yellow-100 p-6 rounded-3xl shadow-sm border border-yellow-200 cursor-pointer hover:shadow-md transition-all group">
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

      {/* NEW GLOBAL SCOUT SECTION (The Globe moved here) */}
      <section className="pt-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-xl text-green-600">
                <MapIcon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-gray-900">Global Scout Map</h3>
            </div>
            <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
              Explore live durian hubs across the globe. Our autonomous scanner tracks real-time availability and weather conditions at verified orchards in Malaysia, Thailand, and Vietnam.
            </p>
          </div>
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">SE Asia Hubs Live</span>
             </div>
             <div className="w-[1px] h-4 bg-slate-200"></div>
             <span className="text-xs font-bold text-slate-400">SCAN: 104.29°E | 3.14°N</span>
          </div>
        </div>
        <div className="relative group">
           <Globe destinations={globeDestinations} onSelectDestination={handleGlobeSelect} activeId={selectedStall?.id} weather={activeWeather} />
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-xl border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pointer-events-none group-hover:text-green-600 transition-colors">
             Drag to rotate • Scroll to zoom
           </div>
        </div>
      </section>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return null;
    switch (view) {
      case 'vr': return <VRViewer />;
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
          <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedStall(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg">✕</button>
            <div className="h-64 relative bg-slate-100">
              <img src={modalImgSrc} className="w-full h-full object-cover" onError={handleModalImageError} />
              <div className="absolute bottom-6 left-6 text-white drop-shadow-lg"><h2 className="text-3xl font-black">{selectedStall.name}</h2></div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Price Catalog</h3>
                <span className="text-xs text-gray-400">Last updated today</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {selectedStall.varieties.map((v, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-green-600 transition-colors">
                    <p className="font-bold text-gray-600 text-sm">{v.name}</p>
                    <p className="text-2xl font-black text-green-700">RM{v.pricePerKg}<span className="text-xs text-gray-400 font-normal">/kg</span></p>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex gap-4">
                <a href={`https://wa.me/${selectedStall.whatsapp}`} target="_blank" className="flex-1 bg-green-600 text-white text-center py-4 rounded-2xl font-bold hover:bg-green-700 shadow-xl shadow-green-100 transition-all">WhatsApp Order</a>
                <button className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">Directions</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
