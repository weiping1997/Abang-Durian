
import React from 'react';
import { Stall } from '../types';

interface StallCardProps {
  stall: Stall;
  onSelect: (stall: Stall) => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onSelect }) => {
  const mkVariety = stall.varieties.find(v => v.name.includes('Musang King'));

  return (
    <div 
      onClick={() => onSelect(stall)}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={stall.photos[0]} 
          alt={stall.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ★ {stall.ratings.overall}
          </div>
          {stall.distance !== undefined && (
            <div className="bg-white/90 backdrop-blur-md text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              📍 {stall.distance}km away
            </div>
          )}
        </div>
        {mkVariety && (
          <div className="absolute bottom-4 right-4 bg-green-700 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg">
            MK RM{mkVariety.pricePerKg}/kg
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-600 transition-colors">{stall.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {stall.address}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
          <div className="flex -space-x-2">
            {stall.varieties.slice(0, 3).map((v, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full bg-green-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-green-700 uppercase"
                title={v.name}
              >
                {v.name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Updated {mkVariety?.lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StallCard;
