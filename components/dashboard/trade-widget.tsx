"use-client"

import React from 'react';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Memecoin } from './trading-section';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectGroup, 
  SelectScrollDownButton, 
  SelectScrollUpButton, 
  SelectValue } from '../ui/select';


interface TradeWidgetProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
  selectedCoin: Memecoin;
  handleCoinChange: (value: string) => void;
  memeCoins: Memecoin[];
  handleTrade: () => void;
  handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  amount: number;
  usdValue: number;
}

const TradeWidget: React.FC<TradeWidgetProps> = ({
  setActiveTab, 
  activeTab, 
  selectedCoin, 
  handleCoinChange, 
  memeCoins, 
  handleTrade, 
  handleAmountChange, 
  amount, 
  usdValue,
}) => {
  // Calculate fee and total cost
  const fee = usdValue * 0.001; // 0.1% fee
  const totalCost = usdValue + fee;

  // Disable the Buy/Sell button if no coin is selected or amount is 0
  const isButtonDisabled = !selectedCoin || amount <= 0;

  return (
    <div className="bg-white p-6 rounded-lg border w-full md:max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Trade Coins</h2>
      <div className="flex justify-between mb-4">
        <Button 
          onClick={() => setActiveTab('buy')} 
          className={`px-16 py-2 rounded hover:text-white ${activeTab === 'buy' ? 'bg-gray-900 text-white' : 'bg-white-200 text-gray-900 border'}`}
        >
          Buy
        </Button>
        <Button 
          onClick={() => setActiveTab('sell')} 
          className={`px-16 py-2 rounded hover:text-white ${activeTab === 'sell' ? 'bg-gray-900 text-white' : 'bg-white-200 text-gray-900 border'}`}
        >
          Sell
        </Button>
      </div>
     
      <div className='w-full max-w-sm my-4'>
        <Select onValueChange={(value) => handleCoinChange(value)} value={selectedCoin ? selectedCoin.id : ''}>
          <SelectTrigger className='w-full text-left p-2 border rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900'>
            <SelectValue placeholder="Select a coin" />
          </SelectTrigger>
          <SelectContent  >
            <SelectScrollUpButton />
              <SelectGroup>
                {memeCoins.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id} className='max-w-xs'>
                    <div className='flex gap-2 items-center'>
                      <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full mr-2" />
                      <span className="font-medium">{coin.name}</span>
                      <span className='uppercase text-gray-400'>({coin.symbol})</span>
                      <span className="text-xs text-gray-500">${coin.current_price}</span>
                    </div>
                  </SelectItem> 
                ))}
              </SelectGroup>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between mb-4 items-center">
        <input
          type="number"
          value={amount}
          min={0}
          placeholder="Amount"
          onChange={handleAmountChange}
          className="w-full p-2 border rounded"
        />
        <ArrowUpDown size={32} />
        <input
          type="text"
          placeholder="USD value"
          value={usdValue}
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>
      <Button 
      onClick={handleTrade} 
      disabled={isButtonDisabled}
      className="bg-gray-900 text-white w-full py-2 rounded disabled:bg-gray-700"
      >
        {activeTab === 'buy' ? `Buy ${selectedCoin?.name || ''}` : `Sell ${selectedCoin?.name || ''}`}
      </Button>

      {/* Dynamic Order Preview */}
      {amount > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Order Preview</h2>
          <table className="w-full border flex justify-between bg-gray-100">
            <thead className=''>
              <tr>
                <th className="py-2 px-4 text-left block">Token</th>
                <th className="py-2 px-4 text-left block">Amount</th>
                <th className="py-2 px-4 text-left block">Price</th>
                <th className="py-2 px-4 text-left block">Total value</th>
                <th className="py-2 px-4 text-left block">Fee (0.1%)</th>
                <th className="py-2 px-4 text-left block">Total cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td className="py-2 px-4 block">{selectedCoin.name}</td>
                <td className="py-2 px-4 block">{amount} {selectedCoin.name}</td>
                <td className="py-2 px-4 block">${selectedCoin.current_price.toFixed(2)}</td>
                <td className="py-2 px-4 block">${usdValue.toFixed(2)}</td>
                <td className="py-2 px-4 block">${fee.toFixed(2)}</td>
                <td className="py-2 px-4 block font-medium">${totalCost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TradeWidget;