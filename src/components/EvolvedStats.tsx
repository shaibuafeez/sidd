'use client';

import { useSuiClientQuery, useSuiClient } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { useEffect, useState } from 'react';

export function EvolvedStats() {
  const client = useSuiClient();
  const [remaining, setRemaining] = useState<number | null>(null);

  // Fetch evolved stats
  const { data: evolvedStatsData, refetch } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.EVOLVED_STATS_ID,
    options: {
      showContent: true,
    },
  }, {
    enabled: CONTRACT_CONSTANTS.EVOLVED_STATS_ID !== '',
  });

  useEffect(() => {
    // Simply calculate from stats data
    if (evolvedStatsData?.data?.content && 'fields' in evolvedStatsData.data.content) {
      const minted = Number((evolvedStatsData.data.content.fields as any).evolved_minted || 0);
      setRemaining(CONTRACT_CONSTANTS.EVOLVED_SUPPLY - minted);
    }
  }, [evolvedStatsData]);

  // Also refetch when NFTs are updated
  useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };

    window.addEventListener('nft-updated', handleUpdate);
    return () => window.removeEventListener('nft-updated', handleUpdate);
  }, [refetch]);

  if (!evolvedStatsData || remaining === null) {
    return null;
  }

  const evolvedMinted = evolvedStatsData.data?.content && 'fields' in evolvedStatsData.data.content 
    ? Number((evolvedStatsData.data.content.fields as any).evolved_minted || 0)
    : 0;

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 mb-8 shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">THE SUDOZ Collection</h2>
        <div className="text-4xl font-bold mb-2">
          {remaining} / {CONTRACT_CONSTANTS.EVOLVED_SUPPLY}
        </div>
        <p className="text-lg">Evolved NFTs Remaining</p>
        <p className="text-sm mt-2 opacity-90">
          {evolvedMinted} already evolved from Level 10 artifacts
        </p>
      </div>
    </div>
  );
}