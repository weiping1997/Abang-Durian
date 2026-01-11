
import React, { useMemo } from 'react';
import { Stall, DurianType } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PriceComparisonTableProps {
  stalls: Stall[];
}

const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({ stalls }) => {
  const [selectedType, setSelectedType] = React.useState<string>(DurianType.MUSANG_KING);

  const comparisonData = useMemo(() => {
    return stalls
      .map(stall => {
        const variety = stall.varieties.find(v => v.name === selectedType);
        return { name: stall.name, price: variety?.pricePerKg || 0 };
      })
      .filter(item => item.price > 0)
      .sort((a, b) => a.price - b.price);
  }, [stalls, selectedType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Object.values(DurianType).map(type => (
          <button key={type} onClick={() => setSelectedType(type)} className={`px-4 py-2 rounded-full border ${selectedType === type ? 'bg-green-600 text-white' : 'bg-white'}`}>{type}</button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="price" fill="#16a34a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceComparisonTable;
