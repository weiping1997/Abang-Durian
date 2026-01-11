
import React from 'react';
import { Stall } from '../types.ts';

interface StallCardProps {
  stall: Stall;
  onSelect: (stall: Stall) => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onSelect }) => {
  const mkVariety = stall.varieties.find(v => v.name.includes('Musang King') || v.name.includes('Monthong'));

  return (
    <div 
      onClick={() => onSelect(stall)}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={stall.photos[0]} alt={stall.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">★ {stall.ratings.overall}</div>
          {stall.distance !== undefined && (
            <div className="bg-white/90 backdrop-blur-md text-green-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg">📍 {stall.distance}km</div>
          )}
        </div>
        {mkVariety && (
          <div className="absolute bottom-4 right-4 bg-green-700 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg">RM{mkVariety.pricePerKg}/kg</div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-600">{stall.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{stall.address}</p>
      </div>
    </div>
  );
};

export default StallCard;
