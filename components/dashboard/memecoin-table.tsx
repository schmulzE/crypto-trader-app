"use client"

import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from 'recharts';

interface Memecoin {
  id: number;
  name: string;
  image: string;
  symbol: string;
  market_cap: number;
  current_price: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

interface MemecoinTableProps {
  memeCoins: Memecoin[];
}

// Simulate price history data for a coin
const generatePriceHistory = (initialPrice: number) => {
  const history = [];
  let price = initialPrice;
  for (let i = 0; i < 16; i++) {
    history.push({ time: i, price: +(price + (Math.random() - 0.5)).toFixed(2) });
    price = history[history.length - 1].price;
  }
  return history;
};

const MemecoinTable: React.FC<MemecoinTableProps> = ({ memeCoins }) => {
  const [data, setData] = useState(memeCoins);
  const [selectedCoin, setSelectedCoin] = useState<Memecoin | null>(null);
  const [priceHistory, setPriceHistory] = useState<{ time: number; price: number }[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((coin) => ({
          ...coin,
          current_price: +(coin.current_price + (Math.random() - 0.5)).toFixed(2),
          price_change_percentage_24h: +(coin.price_change_percentage_24h + (Math.random() - 0.5)).toFixed(2),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle coin click
  const handleCoinClick = (coin: Memecoin) => {
    setSelectedCoin(coin);
    // Generate price history for the selected coin
    setPriceHistory(generatePriceHistory(coin.current_price));
  };

  const formatYAxisTick = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">Coin Rankings</h1>
      <div className="overflow-x-auto h-full">
      <table className="min-w-full bg-white border-gray-200">
        <thead>
        <tr className="bg-gray-50 text-md">
          <th className="py-2 px-4 border-b">Rank</th>
          <th className="py-2 px-4 border-b text-left">Name</th>
          <th className="py-2 px-4 border-b text-right">Price</th>
          <th className="py-2 px-4 border-b text-right">24hr Change</th>
          <th className="py-2 px-4 border-b text-right">Market Cap</th>
        </tr>
        </thead>
        <tbody>
        {data.map((coin, index) => (
          <tr 
          key={coin.id} 
          className="hover:bg-gray-50 text-sm cursor-pointer"
          onClick={() => handleCoinClick(coin)} 
          >
          <td className="py-2 px-4 border-b text-center">{coin.market_cap_rank}</td>
          <td className="py-2 px-4 border-b">
            <div className="flex justify-start content-center items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6" />
              <span className='text-semibold'>{coin.name}</span>
              <span className='text-gray-400 uppercase'>({coin.symbol})</span>
            </div>
          </td>
          <td className="py-2 px-4 border-b text-right">
            ${coin.current_price.toLocaleString()}
          </td>
          <td className={`py-2 px-4 border-b text-right ${
            coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            <div className='flex gap-x-2 justify-end content-center'>
              { coin.price_change_percentage_24h >= 0 ? <TrendingUp className='w-4 h-4' /> : <TrendingDown className='w-4 h-4'/> }
              { coin.price_change_percentage_24h.toFixed(2)}%
            </div>
          </td>
          <td className="py-2 px-4 border-b text-right">
            ${coin.market_cap.toLocaleString()}
          </td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>

      {/* Display the chart when a coin is selected */}
      {selectedCoin && (
      <div className="mt-8 bg-gray-900 p-2 rounded">
        <h2 className="text-xl font-bold mb-4 text-blue-500 ml-8">{selectedCoin.name} Price Movement</h2>
        <div className="h-96"> {/* Increased height */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
            <XAxis
            dataKey="time"
            stroke="#CBD5E0"
            tick={{ fill: '#CBD5E0', fontSize: 12 }}
            interval={window.innerWidth < 768 ? 3 : 0} // Show 4 labels in mobile view
            tickFormatter={(time) => {
            const date = new Date();
            date.setDate(date.getDate() - (15 - time));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
            />
            <YAxis
            stroke="#CBD5E0"
            tick={{ fill: '#CBD5E0', fontSize: 12 }}
            tickFormatter={formatYAxisTick}
            />
            <Tooltip
            contentStyle={{
            backgroundColor: '#2D3748',
            border: '1px solid #4A5568',
            borderRadius: '4px',
            }}
            cursor={false}
            labelFormatter={() => ''}
            formatter={(value, name, props) => {
              const date = new Date();
              date.setDate(date.getDate() - (15 - props.payload.time));
              return [
                <>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#63B3ED', display: 'block', marginTop: '4px' }}>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>${value.toLocaleString()}</span>
                </>
              ];
            }}
            />
            <Line
            type="step"
            dataKey="price"
            connectNulls={false}
            stroke="#63B3ED"
            dot={false}
            activeDot={true}
            label={false}
            />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      )}
    </div>
  );
};

export default MemecoinTable;