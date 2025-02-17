import { Suspense } from 'react';
import { getTopCoins } from "@/utils/coingecko";
import MemecoinTable from '@/components/dashboard/memecoin-table';
import TradingSection from '@/components/dashboard/trading-section';

export default async function Home() {
  const memeCoins = await getTopCoins()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4 pl-0 md:pl-4 pb-4 container mx-auto">
      <div className="md:col-span-2">
        <Suspense fallback={<div>Loading leaderboard...</div>}>
          <MemecoinTable memeCoins={memeCoins}/>
        </Suspense>
      </div>
      <div className='md:col-span-1'>
        <TradingSection memeCoins={memeCoins}/>
      </div>
    </div>
  )
}

