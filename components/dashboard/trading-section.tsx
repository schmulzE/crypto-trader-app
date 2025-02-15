"use client"

import Holdings from "./holdings";
import Portfolio from "./portfolio";
import TradeWidget from "./trade-widget";
import { useState, useEffect, useMemo } from "react";

// State to store trade history
interface Trade {
  type: string;
  coin: string;
  amount: number;
  usdValue: number;
  timestamp: string;
}

interface Holding {
  name: string;
  image: string;
  amount: number;
  averageBuyPrice: number;
  symbol: string;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Memecoin {
  id: string;
  market_cap_rank: number;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  price: number; // Add the price property
  symbol: string;
}

interface TradingSectionProps {
  memeCoins: Memecoin[];
}

const TradingSection: React.FC<TradingSectionProps> = ({memeCoins}) => {

  // State for the selected tab (Buy or Sell)
  const [activeTab, setActiveTab] = useState('buy');
  // State for the selected coin, amount, and USD value
  const [selectedCoin, setSelectedCoin] = useState<Memecoin | null>(null);
  const [amount, setAmount] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  // State to track holdings (coins you own)
  const [holdings, setHoldings] = useState<Holding[]>([]);
  // State to track total cost, total value, and profit/loss
  const [totalCost, setTotalCost] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [profitLossMargin, setProfitLossMargin] = useState(0);
  

  // Simulate real-time price updates for holdings
  useEffect(() => {
    const interval = setInterval(() => {
      setHoldings((prevHoldings) =>
        prevHoldings.map((holding) => ({
          ...holding,
          currentPrice: parseFloat((holding.currentPrice + Math.random() - 0.5).toFixed(2)), // Simulate price change
        }))
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

   // Compute Total Value & Profit/Loss Margin in Real-Time
   useEffect(() => {
    const newTotalValue = holdings.reduce((sum, h) => sum + h.amount * h.currentPrice, 0);
    setTotalValue(newTotalValue);

    // Prevent NaN by only calculating profit/loss if totalCost is greater than zero
    if (totalCost > 0) {
      const margin = ((newTotalValue - totalCost) / totalCost) * 100;
      setProfitLossMargin(parseFloat(margin.toFixed(2)));
    } else {
      setProfitLossMargin(0);
    }
  }, [holdings, totalCost]);

    const sellHolding = (holding: { amount: any; name: string; }, sellPrice: number) => {
      const sellAmount = holding.amount;
      const sellValue = sellAmount * sellPrice;
    
      // Update total value
      setTotalValue((prevValue) => prevValue - sellValue);
    
      // Remove the holding from the list
      setHoldings((prevHoldings) =>
        prevHoldings.filter((h) => h.name !== holding.name)
      );
    
      // Add the sale to trade history
      const trade = {
        type: 'sell',
        coin: holding.name,
        amount: sellAmount,
        usdValue: parseFloat(sellValue.toFixed(2)),
        timestamp: new Date().toLocaleString(),
      };
      setTradeHistory([...tradeHistory, { ...trade, coin: trade.coin! }]);
    
      console.log('Holding sold:', holding.name);
    };


  // Memoize available coins to prevent unnecessary recalculations
  const availableCoins = useMemo(() => {
    return activeTab === "sell"
      ? holdings
          .map((h) => memeCoins.find((c) => c.name === h.name))
          .filter((coin): coin is Memecoin => coin !== undefined)
      : memeCoins;
  }, [activeTab, holdings, memeCoins]);

  useEffect(() => {
    if (availableCoins.length > 0) {
      const isSelectedValid = availableCoins.some(
        (c) => c.id === selectedCoin?.id
      );
  
      if (!isSelectedValid) {
        setSelectedCoin(null); // Ensure default selection
      }
    } else {
      setSelectedCoin(null); // Handle empty list case
    }
  }, [availableCoins, activeTab]); // Ensure it runs when the tab changes
  

  // Correct coin search to use availableCoins
  const handleCoinChange = (value: string) => {
    const coin = availableCoins.find((c) => c.id === value);
    if (coin) {
      setSelectedCoin(coin);
      updateUsdValue(amount, coin.current_price);
    }
  };


  // Handle amount change
  const handleAmountChange = (e: { target: { value: string; }; }) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount);
    updateUsdValue(newAmount, selectedCoin?.current_price!);
  };

  // Update USD value based on amount and coin price
  const updateUsdValue = (amount: number, price: number) => {
    const value = isNaN(amount) ? 0 : amount * price;
    setUsdValue(parseFloat(value.toFixed(2)));
  };

  // Handle trade execution (Buy or Sell)
  const handleTrade = () => {
      const trade = {
        type: activeTab,
        coin: selectedCoin?.name,
        amount: amount,
        usdValue: parseFloat(usdValue.toFixed(2)),
        timestamp: new Date().toLocaleString(),
      };
  
      // Add the trade to the trade history
      setTradeHistory([...tradeHistory, { ...trade, coin: trade.coin! }]);
  
      // Update holdings based on the trade type
      if (activeTab === 'buy') {
        // Add or update the holding
        const existingHolding = holdings.find((h) => h.name === selectedCoin?.name);
        if (existingHolding) {
          // Update average buy price and total amount
          const totalAmount = existingHolding.amount + amount;
          const totalCost = existingHolding.averageBuyPrice * existingHolding.amount + usdValue;
          const averageBuyPrice = totalCost / totalAmount;
  
          setHoldings((prevHoldings) =>
            prevHoldings.map((h) =>
              h.name === selectedCoin?.name
                ? {
                    ...h,
                    amount: totalAmount,
                    averageBuyPrice: averageBuyPrice,
                  }
                : h
            )
          );
        } else {
          // Add new holding
          setHoldings([
            ...holdings,
            {
              name: selectedCoin?.name!,
              image: selectedCoin?.image!,
              amount: amount,
              symbol: selectedCoin?.symbol!,
              averageBuyPrice: usdValue / amount,
              currentPrice: selectedCoin?.current_price!,
            },
          ]);
        }
  
        // Update total cost and total value
        setTotalCost((prevCost) => prevCost + usdValue);
        setTotalValue((prevValue) => prevValue + usdValue);
      } else if (activeTab === 'sell') {
        // Reduce the holding amount
        const existingHolding = holdings.find((h) => h.name === selectedCoin?.name);
        if (existingHolding) {
          const remainingAmount = existingHolding.amount - amount;
          if (remainingAmount > 0) {
            setHoldings((prevHoldings) =>
              prevHoldings.map((h) =>
                h.name === selectedCoin?.name
                  ? { ...h, amount: remainingAmount }
                  : h
              )
            );
          } else {
            // Remove the holding if the amount reaches 0
            setHoldings((prevHoldings) =>
              prevHoldings.filter((h) => h.name !== selectedCoin?.name)
            );
          }
        }
  
        // Update total value
        setTotalValue((prevValue) => prevValue - usdValue);
      }

      // Reset form fields
      setAmount(0);
      setUsdValue(0);
      setSelectedCoin(null)
  
    };

    // Handle setting stop loss or take profit for a holding
    const handleSetStopLossTakeProfit = (holding: { name: string; }, type: any, value: any) => {
      setHoldings((prevHoldings) =>
        prevHoldings.map((h) =>
          h.name === holding.name
            ? {
                ...h,
                [type]: value,
              }
            : h
        )
      );
    };

  return (
    <div className="bg-white rounded-lg space-y-4 mx-2 md:mx-0">
      <TradeWidget
        amount={amount}
        usdValue={usdValue}
        activeTab={activeTab}
        handleTrade={handleTrade}
        memeCoins={availableCoins}
        setActiveTab={setActiveTab}
        selectedCoin={selectedCoin!}
        handleCoinChange={handleCoinChange}
        handleAmountChange={handleAmountChange}
      />

      <Portfolio 
        totalCost={totalCost}
        totalValue={totalValue}
        profitLossMargin={profitLossMargin}
      />

      <Holdings 
      holdings={holdings} 
      sellHolding={sellHolding}
      handleSetStopLossTakeProfit={handleSetStopLossTakeProfit} 
      />
    </div>
  )
}

export default TradingSection;