'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { CONTRACT_CONSTANTS } from '@/constants/contract';

export function AdminSection() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [hasAdminCap, setHasAdminCap] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [adminCapId, setAdminCapId] = useState<string | null>(null);
  const [hasEvolvedAdminCap, setHasEvolvedAdminCap] = useState(false);
  const [evolvedAdminCapId, setEvolvedAdminCapId] = useState<string | null>(null);
  const [isMintingDevReserve, setIsMintingDevReserve] = useState(false);
  const [selectedOneOfOne, setSelectedOneOfOne] = useState<number>(CONTRACT_CONSTANTS.ONE_OF_ONE_IDS[0]);
  const [batchSize, setBatchSize] = useState<number>(50);

  // Check if current account owns the AdminCap
  const { data: adminCapData } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::AdminCap`,
    },
  }, {
    enabled: !!account,
  });

  // Check if current account owns the EvolvedAdminCap
  const { data: evolvedAdminCapData } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::EvolvedAdminCap`,
    },
  }, {
    enabled: !!account && CONTRACT_CONSTANTS.EVOLVED_ADMIN_CAP_ID !== '',
  });

  // Fetch global stats to show accumulated fees
  const { data: statsData, refetch: refetchStats } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.GLOBAL_STATS_ID,
    options: {
      showContent: true,
    },
  });

  // Fetch evolved stats if available
  const { data: evolvedStatsData, refetch: refetchEvolvedStats } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.EVOLVED_STATS_ID,
    options: {
      showContent: true,
    },
  }, {
    enabled: CONTRACT_CONSTANTS.EVOLVED_STATS_ID !== '',
  });

  useEffect(() => {
    console.log('AdminCap query result:', adminCapData);
    console.log('AdminCap data array:', adminCapData?.data);
    if (adminCapData?.data && adminCapData.data.length > 0) {
      setHasAdminCap(true);
      // Get the actual AdminCap object ID
      const adminCap = adminCapData.data[0];
      const capId = adminCap.data?.objectId || null;
      console.log('Found AdminCap:', capId);
      console.log('AdminCap data:', adminCap);
      setAdminCapId(capId);
    } else if (account?.address === '0x4822bfc9c86d1a77daf48b0bdf8f012ae9b7f8f01b4195dc0f3fd4fb838525bd') {
      // Manually set for known admin address
      console.log('Manually setting AdminCap for known admin address');
      setHasAdminCap(true);
      setAdminCapId('0x7a85f836ba0812d9c5bbb5863a6631cde450d9be5141acf2a7d8c5c241a508bf');
    } else {
      setHasAdminCap(false);
      setAdminCapId(null);
      console.log('No AdminCap found for address:', account?.address);
      console.log('AdminCap filter:', `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::AdminCap`);
    }
  }, [adminCapData, account]);

  useEffect(() => {
    if (evolvedAdminCapData?.data && evolvedAdminCapData.data.length > 0) {
      setHasEvolvedAdminCap(true);
      // Get the actual EvolvedAdminCap object ID
      const evolvedAdminCap = evolvedAdminCapData.data[0];
      setEvolvedAdminCapId(evolvedAdminCap.data?.objectId || null);
    } else {
      setHasEvolvedAdminCap(false);
      setEvolvedAdminCapId(null);
    }
  }, [evolvedAdminCapData]);

  // Check if current account is authorized
  const isFounder = account?.address === CONTRACT_CONSTANTS.REVENUE_CONFIG.FOUNDER_ADDRESS;
  const isDev = account?.address === CONTRACT_CONSTANTS.REVENUE_CONFIG.DEV_ADDRESS;
  const isDeployer = account?.address === CONTRACT_CONSTANTS.REVENUE_CONFIG.DEPLOYER_ADDRESS;

  if (!account || (!hasAdminCap && !isFounder && !isDev && !isDeployer)) {
    return null;
  }

  const content = statsData?.data?.content;
  const stats: any = content && 'fields' in content ? content.fields : {};
  // Get pool balances for v2 contract
  const devPoolBalance = stats.dev_pool || '0';
  const founderPoolBalance = stats.founder_pool || '0';
  const devPoolInSui = Number(devPoolBalance) / 1_000_000_000;
  const founderPoolInSui = Number(founderPoolBalance) / 1_000_000_000;
  const totalFeesInSui = devPoolInSui + founderPoolInSui;
  const artifactsMinted = stats.artifacts_minted || '0';
  const artifactsBurned = stats.artifacts_burned || '0';
  const evolvedMinted = stats.evolved_minted || '0';
  
  // Also get evolved stats directly if available
  const evolvedContent = evolvedStatsData?.data?.content;
  const evolvedStatsFields: any = evolvedContent && 'fields' in evolvedContent ? evolvedContent.fields : {};
  const actualEvolvedMinted = evolvedStatsFields.evolved_minted || evolvedMinted;
  const level10Burns = stats.level_10_burns || '0';
  
  console.log('Stats data:', stats);
  console.log('Artifacts minted:', artifactsMinted);

  const handleWithdrawFees = async () => {
    if (!isFounder || founderPoolInSui <= 0) return;

    setIsWithdrawing(true);
    try {
      const tx = new Transaction();
      
      console.log('Founder withdrawal - GlobalStats ID:', CONTRACT_CONSTANTS.GLOBAL_STATS_ID);
      console.log('Founder withdrawal - Package ID:', CONTRACT_CONSTANTS.PACKAGE_ID);
      console.log('Founder withdrawal - Module:', CONTRACT_CONSTANTS.MODULE_NAME);
      console.log('Founder withdrawal - Account:', account.address);
      
      // For founder withdrawal - no AdminCap needed, just founder address
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::withdraw_founder_pool`,
        arguments: [
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });

      // Set gas budget for withdrawal transaction
      tx.setGasBudget(2000000000); // 2 SUI

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('Founder withdrawal successful:', result);
      
      if (result.digest) {
        alert(`Founder pool withdrawal successful! Transaction: ${result.digest}\n\nView on explorer: https://suivision.xyz/txblock/${result.digest}`);
      }
      
      // Refresh stats with delay
      setTimeout(async () => {
        await refetchStats();
      }, 2000);
    } catch (error) {
      console.error('Founder withdrawal failed:', error);
      alert(`Founder withdrawal failed: ${error}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleWithdrawDevFees = async () => {
    if (!isDev || devPoolInSui <= 0) return;

    setIsWithdrawing(true);
    try {
      const tx = new Transaction();

      console.log('Dev withdrawal - GlobalStats ID:', CONTRACT_CONSTANTS.GLOBAL_STATS_ID);
      console.log('Dev withdrawal - Package ID:', CONTRACT_CONSTANTS.PACKAGE_ID);
      console.log('Dev withdrawal - Module:', CONTRACT_CONSTANTS.MODULE_NAME);
      console.log('Dev withdrawal - Account:', account.address);

      // For dev withdrawal - no AdminCap needed, just dev address
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::withdraw_dev_pool`,
        arguments: [
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });

      // Set gas budget for withdrawal transaction
      tx.setGasBudget(2000000000); // 2 SUI

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('Dev withdrawal successful:', result);
      
      if (result.digest) {
        alert(`Dev pool withdrawal successful! Transaction: ${result.digest}\n\nView on explorer: https://suivision.xyz/txblock/${result.digest}`);
      }
      
      // Refresh stats with delay
      setTimeout(async () => {
        await refetchStats();
      }, 2000);
    } catch (error) {
      console.error('Dev withdrawal failed:', error);
      alert(`Dev withdrawal failed: ${error}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleMintArtifact = async () => {
    if (!hasAdminCap || !adminCapId || !account) {
      alert('Missing requirements: AdminCap or account not found');
      return;
    }

    setIsMinting(true);
    try {
      const tx = new Transaction();

      const target = `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_ARTIFACT}`;
      console.log('Target:', target);
      console.log('AdminCap:', adminCapId);
      console.log('Account:', account.address);
      console.log('GlobalStats:', CONTRACT_CONSTANTS.GLOBAL_STATS_ID);

      tx.moveCall({
        target,
        arguments: [
          tx.object(adminCapId),
          tx.pure.address(account.address),
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });

      // Set gas budget for mint transaction
      tx.setGasBudget(2000000000); // 2 SUI

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('Mint result:', result);
      console.log('Transaction digest:', result.digest);
      
      // The result structure from dapp-kit is different
      if (result.digest) {
        // Transaction was submitted successfully
        console.log('Transaction submitted successfully');
        alert(`NFT minted successfully! Transaction: ${result.digest}\n\nView on explorer: https://suivision.xyz/txblock/${result.digest}`);
        
        // Also log the effects if available
        if (result.effects) {
          console.log('Effects:', result.effects);
        }
      } else {
        console.error('Transaction may have failed:', result);
        alert('Transaction may have failed. Check console for details.');
      }
      
      // Trigger a refetch with longer delay
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 2000);
      
      // Refresh stats
      await refetchStats();
    } catch (error: any) {
      console.error('Mint failed:', error);
      alert(`Mint failed: ${error.message || error}`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleMintOneOfOne = async () => {
    if (!hasEvolvedAdminCap || !evolvedAdminCapId || !account || !CONTRACT_CONSTANTS.EVOLVED_STATS_ID) return;

    setIsMintingDevReserve(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_DEVELOPER_RESERVE_SPECIFIC}`,
        arguments: [
          tx.object(evolvedAdminCapId),
          tx.pure.address(account.address),
          tx.pure.u64(selectedOneOfOne),
          tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
        ],
      });

      // Set gas budget for evolved mint transaction
      tx.setGasBudget(2000000000); // 2 SUI

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('1/1 mint successful:', result);
      
      // Trigger a refetch
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 1000);
      
      // Refresh evolved stats
      if (refetchEvolvedStats) {
        await refetchEvolvedStats();
        console.log('Evolved stats refetched after 1/1 mint');
      }
    } catch (error) {
      console.error('1/1 mint failed:', error);
    } finally {
      setIsMintingDevReserve(false);
    }
  };

  const handleMintAllOneOfOnes = async () => {
    if (!hasEvolvedAdminCap || !evolvedAdminCapId || !account || !CONTRACT_CONSTANTS.EVOLVED_STATS_ID) return;

    setIsMintingDevReserve(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_DEVELOPER_RESERVE_ONE_OF_ONES}`,
        arguments: [
          tx.object(evolvedAdminCapId),
          tx.pure.address(account.address),
          tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
        ],
      });

      // Set gas budget for evolved mint transaction
      tx.setGasBudget(5000000000); // 5 SUI for batch operation

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('All 1/1s mint successful:', result);
      
      // Trigger a refetch
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 1000);
      
      // Refresh evolved stats
      if (refetchEvolvedStats) await refetchEvolvedStats();
    } catch (error) {
      console.error('All 1/1s mint failed:', error);
    } finally {
      setIsMintingDevReserve(false);
    }
  };

  const handleMintRandomBatch = async () => {
    if (!hasEvolvedAdminCap || !evolvedAdminCapId || !account || !CONTRACT_CONSTANTS.EVOLVED_STATS_ID) return;

    setIsMintingDevReserve(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_DEVELOPER_RESERVE_BATCH}`,
        arguments: [
          tx.object(evolvedAdminCapId),
          tx.pure.address(account.address),
          tx.pure.u64(batchSize),
          tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
          tx.object(CONTRACT_CONSTANTS.RANDOM_OBJECT_ID),
        ],
      });

      // Set gas budget for evolved batch mint transaction
      tx.setGasBudget(5000000000); // 5 SUI for batch operation

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('Random batch mint successful:', result);
      
      // Trigger a refetch
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 1000);
      
      // Refresh evolved stats
      if (refetchEvolvedStats) await refetchEvolvedStats();
    } catch (error) {
      console.error('Random batch mint failed:', error);
    } finally {
      setIsMintingDevReserve(false);
    }
  };

  return (
    <div className="mb-8 bg-red-50 border-2 border-red-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-black">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-600">Artifacts Minted</p>
          <p className="text-2xl font-bold text-black">{artifactsMinted}/13,600</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-600">Artifacts Burned</p>
          <p className="text-2xl font-bold text-black">{artifactsBurned}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-600">Evolved Minted</p>
          <p className="text-2xl font-bold text-black">{actualEvolvedMinted}/5,555</p>
          <p className="text-sm text-green-600 font-medium">
            {5555 - Number(actualEvolvedMinted)} left
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-600">Level 10 Burns</p>
          <p className="text-2xl font-bold text-black">{level10Burns}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-bold mb-4 text-black">Fee Management - Auto-Split Pools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Founder Pool (85%)</p>
            <p className="text-2xl font-bold text-black">{founderPoolInSui.toFixed(4)} SUI</p>
            <p className="text-xs text-gray-500">Admin withdrawable</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Dev Pool (15%)</p>
            <p className="text-2xl font-bold text-black">{devPoolInSui.toFixed(4)} SUI</p>
            <p className="text-xs text-gray-500">Protected - Dev only</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Accumulated Fees</p>
            <p className="text-3xl font-bold text-black">{totalFeesInSui.toFixed(4)} SUI</p>
          </div>
          
          {isFounder && (
            <button
              onClick={handleWithdrawFees}
              disabled={isWithdrawing || founderPoolInSui === 0}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors font-medium"
            >
              {isWithdrawing ? 'Withdrawing...' : `Withdraw Founder Pool (${founderPoolInSui.toFixed(2)} SUI)`}
            </button>
          )}
          {!isFounder && !isDev && (
            <p className="text-sm text-gray-500">Only founder/dev addresses can withdraw</p>
          )}
        </div>
        
        {isDev && (
          <div className="mt-4">
            <button
              onClick={handleWithdrawDevFees}
              disabled={isWithdrawing || devPoolInSui === 0}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-medium w-full"
            >
              {isWithdrawing ? 'Withdrawing...' : `Withdraw Dev Pool (${devPoolInSui.toFixed(2)} SUI)`}
            </button>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          {isFounder && "You can withdraw the founder's 85% share."}
          {isDev && "You can withdraw the dev's 15% share."}
          {!isFounder && !isDev && "Only authorized addresses can withdraw from their respective pools."}
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow mt-6">
        <h3 className="text-lg font-bold mb-4 text-black">Mint NFTs</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Mint SUDOZ Artifacts</p>
            <p className="text-sm text-gray-500">Current supply: {artifactsMinted}/13,600</p>
          </div>
          
          <button
            onClick={handleMintArtifact}
            disabled={isMinting || Number(artifactsMinted) >= 13600}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-medium"
          >
            {isMinting ? 'Minting...' : 'Mint Artifact'}
          </button>
        </div>
      </div>

      {hasEvolvedAdminCap && CONTRACT_CONSTANTS.EVOLVED_STATS_ID && (
        <div className="bg-white rounded-lg p-6 shadow mt-6">
          <h3 className="text-lg font-bold mb-4 text-black">Developer Reserve - THE SUDOZ Collection</h3>
          
          <div className="space-y-6">
            {/* 1/1 NFTs Section */}
            <div className="border-b pb-4">
              <h4 className="font-medium mb-3 text-black">Mint Specific 1/1 NFTs</h4>
              <p className="text-sm text-gray-600 mb-3">10 specific rare NFTs with predetermined metadata IDs</p>
              
              <div className="flex items-center space-x-4 mb-3">
                <select
                  value={selectedOneOfOne}
                  onChange={(e) => setSelectedOneOfOne(Number(e.target.value))}
                  className="px-3 py-2 border rounded-lg"
                  disabled={isMintingDevReserve}
                >
                  {CONTRACT_CONSTANTS.ONE_OF_ONE_IDS.map((id) => (
                    <option key={id} value={id}>
                      Metadata ID: {id}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={handleMintOneOfOne}
                  disabled={isMintingDevReserve}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
                >
                  {isMintingDevReserve ? 'Minting...' : 'Mint Selected 1/1'}
                </button>
              </div>
              
              <button
                onClick={handleMintAllOneOfOnes}
                disabled={isMintingDevReserve}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors w-full"
              >
                {isMintingDevReserve ? 'Minting...' : 'Mint All 10 1/1s at Once'}
              </button>
            </div>
            
            {/* Random NFTs Section */}
            <div>
              <h4 className="font-medium mb-3 text-black">Mint Random NFTs</h4>
              <p className="text-sm text-gray-600 mb-3">270 random NFTs from the remaining pool</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-black">Batch size:</label>
                  <input
                    type="number"
                    min="1"
                    max={CONTRACT_CONSTANTS.MAX_BATCH_SIZE}
                    value={batchSize}
                    onChange={(e) => setBatchSize(Math.min(CONTRACT_CONSTANTS.MAX_BATCH_SIZE, Math.max(1, Number(e.target.value))))}
                    className="w-20 px-2 py-1 border rounded"
                    disabled={isMintingDevReserve}
                  />
                </div>
                
                <button
                  onClick={handleMintRandomBatch}
                  disabled={isMintingDevReserve}
                  className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition-colors"
                >
                  {isMintingDevReserve ? 'Minting...' : `Mint ${batchSize} Random NFTs`}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Note: Maximum batch size is {CONTRACT_CONSTANTS.MAX_BATCH_SIZE}. For 270 NFTs, you'll need {Math.ceil(270 / CONTRACT_CONSTANTS.MAX_BATCH_SIZE)} transactions.
              </p>
            </div>
            
            {/* Evolved Stats */}
            {evolvedStatsData && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-2 text-black">Evolved Collection Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Evolved Minted</p>
                    <p className="font-bold text-black">
                      {(() => {
                        const count = evolvedStatsData.data?.content && 'fields' in evolvedStatsData.data.content 
                          ? (evolvedStatsData.data.content.fields as any).evolved_minted || '0' 
                          : '0';
                        return count;
                      })()} / {CONTRACT_CONSTANTS.EVOLVED_SUPPLY}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Metadata IDs</p>
                    <p className="font-bold text-black">
                      {evolvedStatsData.data?.content && 'fields' in evolvedStatsData.data.content 
                        ? (evolvedStatsData.data.content.fields as any).available_metadata_ids?.length || '0' 
                        : '0'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p className="font-bold">Admin Notice:</p>
        <p className="text-sm">You are logged in as an admin. Only accounts with AdminCap can see this section and withdraw fees.</p>
      </div>
    </div>
  );
}