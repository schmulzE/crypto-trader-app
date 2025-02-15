"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

interface Holding {
  name: string;
  image: string;
  amount: number;
  symbol: string;
  averageBuyPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
}

interface HoldingsProps {
  holdings: Holding[];
  sellHolding: (holding: Holding, currentPrice: number) => void;
  handleSetStopLossTakeProfit: (holding: Holding, type: string, value: number) => void;
}

const Holdings = ({ holdings, sellHolding }: HoldingsProps) => {
  // Use a state to track the index of the currently expanded coin
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Toggle expanded view for a specific coin
  const toggleExpanded = (index: number) => {
    // Collapse if the same coin is clicked again
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  // Calculate total cost for each holding
  const calculateTotalCost = (holding: Holding) => {
    return holding.amount * holding.averageBuyPrice;
  };

  return (
    <div className="border mt-8 rounded w-full md:max-w-sm">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Holdings</h2>

        {/* List of coins */}
        <div className="space-y-2">
          {holdings.map((holding, index) => (
            <div key={index}>
              <div
                className="p-4 bg-gray-100 rounded cursor-pointer"
                onClick={() => toggleExpanded(index)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-x-2">
                    <img src={holding.image} alt={holding.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium capitalize">{holding.name}</div>
                      <div className="font-medium text-md text-gray-400 uppercase">({holding.symbol})</div>
                    </div>
                  </div>
                  <div>
                    <div>${calculateTotalCost(holding).toFixed(2)}</div>
                    <div className="text-gray-500 text-sm">{holding.amount} coins</div>
                  </div>
                </div>
              </div>

              {/* Expanded table view for the clicked coin only */}
              {expandedIndex === index && (
                <table className="w-full bg-gray-100 flex justify-between flex-wrap">
                  <thead className="">
                    <tr>
                      <th className="py-2 px-4 text-left block">Average Buy Price</th>
                      <th className="py-2 px-4 text-left block">Current Price</th>
                      <th className="py-2 px-4 text-left block">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    <tr className="bg-gray-100 w-full">
                      <td className="py-2 px-4 block">${holding.averageBuyPrice}</td>
                      <td className="py-2 px-4 block">${holding.currentPrice}</td>
                      <td
                        className={`py-2 px-4 block ${
                          ((holding.currentPrice - holding.averageBuyPrice) /
                            holding.averageBuyPrice) *
                            100 >=
                          0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {(
                          ((holding.currentPrice - holding.averageBuyPrice) /
                            holding.averageBuyPrice) *
                          100
                        ).toFixed(2)}
                        %
                      </td>
                    </tr>
                  </tbody>
                  <Button
                    className="bg-red-500 text-white w-full px-2 py-1 m-4 rounded hover:bg-red-400"
                    onClick={() => {
                      sellHolding(holding, holding.currentPrice);
                      // Optionally collapse the expanded view after the action
                      setExpandedIndex(null);
                    }}
                  >
                    Stop Loss
                  </Button>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Holdings;