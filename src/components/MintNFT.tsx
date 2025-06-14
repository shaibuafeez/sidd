'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONSTANTS } from '@/constants/contract';

export function MintNFT() {
  const account = useCurrentAccount();

  return (
    <div className="bg-gray-100 rounded-lg p-6 text-center">
      <h3 className="text-lg font-bold mb-2">Mint NFTs</h3>
      <p className="text-sm text-gray-600 mb-4">
        Note: Only the admin wallet can mint NFTs. This is for testing purposes.
      </p>
      <p className="text-sm text-gray-500">
        If you are the admin, please use the Admin Dashboard above to mint NFTs.
      </p>
    </div>
  );
}