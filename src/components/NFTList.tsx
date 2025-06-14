'use client';

import { useEffect } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { NFTCard } from './NFTCard';

export function NFTList() {
  const account = useCurrentAccount();

  const { data, isLoading, error, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: CONTRACT_CONSTANTS.TYPES.SUDOZ_ARTIFACT,
    },
    options: {
      showType: true,
      showOwner: true,
      showContent: true,
      showDisplay: true,
    },
  }, {
    enabled: !!account,
  });

  // Listen for NFT update events
  useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };

    window.addEventListener('nft-updated', handleUpdate);
    return () => window.removeEventListener('nft-updated', handleUpdate);
  }, [refetch]);

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please connect your wallet to view your NFTs</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading your NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading NFTs: {error.message}</p>
      </div>
    );
  }

  const nfts = data?.data || [];

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have any SUDOZ ARTIFACTS yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={nft.data?.objectId} nft={nft} />
      ))}
    </div>
  );
}