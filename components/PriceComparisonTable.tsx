
import React, { useMemo } from 'react';
import { Stall, DurianType } from '../types';
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
        return {
          name: stall.name,
          price: variety?.pricePerKg || 0,
          available: variety?.availability || false
        };
      })
      .filter(item => item.price > 0)
      .sort((a, b) => a.price - b.price);
  }, [stalls, selectedType]);

  const bestDeal = comparisonData[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.values(DurianType).map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedType === type 
                ? 'bg-green-600 text-white border-green-600 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-900">Price per KG Comparison (RM)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`RM ${value}`, 'Price']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={20}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : '#84cc16'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {bestDeal ? (
            <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100 shadow-sm">
              <span className="text-green-600 font-bold text-xs uppercase tracking-widest bg-white px-2 py-1 rounded-full border border-green-200">
                Current Best Deal
              </span>
              <h4 className="text-2xl font-bold mt-4 text-gray-900">{bestDeal.name}</h4>
              <p className="text-gray-600 text-sm mt-1">Found at {selectedType}</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-black text-green-700">RM{bestDeal.price}</span>
                <span className="text-gray-500 ml-1">/ kg</span>
              </div>
              <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                View Location
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400">
              No data for this variety
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">Seasonal Trend</h4>
            <p className="text-sm text-gray-500">Prices for {selectedType} are currently 15% lower than last week as the peak season begins.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComparisonTable;
