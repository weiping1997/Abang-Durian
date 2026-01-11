
import React from 'react';
import { Stall, DurianType } from '../types';

interface StallCardProps {
  stall: Stall;
  onSelect: (stall: Stall) => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onSelect }) => {
  const bestPrice = Math.min(...stall.varieties.map(v => v.pricePerKg));
  const mkVariety = stall.varieties.find(v => v.name.includes('Musang King'));

  return (
    <div 
      onClick={() => onSelect(stall)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-48">
        <img src={stall.photos[0]} alt={stall.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold shadow-sm">
          ★ {stall.ratings.overall}
        </div>
        {mkVariety && (
          <div className="absolute bottom-2 left-2 bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold shadow-sm">
            Musang King RM{mkVariety.pricePerKg}/kg
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{stall.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          <span className="inline-block mr-1">📍</span> {stall.address}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
          <span className="text-xs text-gray-400">Updated {mkVariety?.lastUpdated}</span>
          <div className="flex space-x-1">
            {stall.varieties.slice(0, 2).map((v, i) => (
              <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {v.name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StallCard;
