
import React, { useState } from 'react';
import { Stall } from '../types.ts';
import { Globe, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface StallCardProps {
  stall: Stall;
  onSelect: (stall: Stall) => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onSelect }) => {
  const [imgSrc, setImgSrc] = useState(stall.photos[0]);
  const [hasError, setHasError] = useState(false);
  const mkVariety = stall.varieties.find(v => v.name.includes('Musang King') || v.name.includes('Monthong'));

  const getUniqueDurianFallback = (id: string) => {
    // Curated list of high-quality durian photo IDs from Unsplash
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
    
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const photoId = durianPhotoIds[hash % durianPhotoIds.length];
    
    return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800&sig=${id}`;
  };

  const handleImageError = () => {
    if (!hasError) {
      setImgSrc(getUniqueDurianFallback(stall.id));
      setHasError(true);
    }
  };

  return (
    <div 
      onClick={() => onSelect(stall)}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={imgSrc} 
          alt={stall.name} 
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {hasError && (
          <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm p-1.5 rounded-full text-white/70">
            <ImageIcon className="w-3 h-3" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">★ {stall.ratings.overall}</div>
          {stall.distance !== undefined && (
            <div className="bg-white/90 backdrop-blur-md text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg">📍 {stall.distance}km</div>
          )}
          {stall.isLiveSource && (
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg flex items-center gap-1 animate-pulse">
              <Globe className="w-2.5 h-2.5" /> Global Market Live
            </div>
          )}
        </div>
        {mkVariety && (
          <div className="absolute bottom-4 right-4 bg-green-700 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg">RM{mkVariety.pricePerKg}/kg</div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-green-600">{stall.name}</h3>
          <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{stall.address}</p>
        <div className="mt-auto flex gap-2">
          {stall.varieties.slice(0, 2).map((v, i) => (
            <span key={i} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md font-bold border border-slate-100">
              {v.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StallCard;
