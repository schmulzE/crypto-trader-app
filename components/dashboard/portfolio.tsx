"use client"

interface PortfolioProps {
  totalCost: number;
  totalValue: number;
  profitLossMargin: number;
}

export default function Portfolio({ totalCost, totalValue, profitLossMargin }: PortfolioProps) {

   // Calculate Profit/Loss in dollars
   const profitLossDollars = totalValue - totalCost;

   // Handle division by zero when calculating profit/loss margin
   const displayProfitLossMargin = totalCost === 0 ? 0 : profitLossMargin;

  return (
    <div className="bg-white p-6 rounded-lg border w-full md:max-w-sm">
      <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-gray-500 text-sm">Total Cost:</p>
          <p className="font-semibold text-2xl">${totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-gray-500 text-sm">Total Value:</p>
          <p className="font-semibold text-2xl">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-gray-500 text-sm">Profit/Loss:</p>
          <div className={"flex gap-2 items-baseline"}>
            <span className="text-2xl font-semibold">${profitLossDollars.toFixed(2)}</span>
            <span className={totalValue - totalCost >= 0 ? "text-green-500 text-md align-bottom" : "text-red-500 text-md"}>{displayProfitLossMargin.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

