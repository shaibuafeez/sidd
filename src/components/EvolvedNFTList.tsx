'use client';

import { useEffect } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';

export function EvolvedNFTList() {
  const account = useCurrentAccount();

  const { data, isLoading, error, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ,
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
    return null;
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading your THE SUDOZ NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading Evolved NFTs: {error.message}</p>
      </div>
    );
  }

  const evolvedNfts = data?.data || [];

  console.log('Evolved NFT query:', {
    type: CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ,
    expectedType: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::EvolvedSudoz`,
    count: evolvedNfts.length,
    data: evolvedNfts
  });

  if (evolvedNfts.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your THE SUDOZ NFTs</h2>
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No THE SUDOZ NFTs yet. Evolve a level 10 artifact to get one!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Your THE SUDOZ NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {evolvedNfts.map((nft) => {
          const contentData = nft.data?.content;
          const content: any = contentData && 'fields' in contentData ? contentData.fields : {};
          const display = nft.data?.display?.data || {};
          const objectId = nft.data?.objectId || '';
          
          const name = display.name || content.name || `THE SUDOZ #${content.number || ''}`;
          let imageUrl = display.image_url || content.image_url || '';
          const number = content.number || '';
          const metadataId = content.metadata_id || '';
          const originalArtifactNumber = content.original_artifact_number || '';
          const originalPath = content.original_path;
          
          console.log('Evolved NFT data:', {
            objectId,
            content,
            display,
            imageUrl,
            metadataId
          });
          
          // Convert IPFS URLs to HTTP gateway URLs
          if (imageUrl.startsWith('ipfs://')) {
            const ipfsHash = imageUrl.replace('ipfs://', '');
            // Use Pinata gateway for better reliability
            imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
          } else if (imageUrl.includes('ipfs.io/ipfs/')) {
            // Already using IPFS gateway, switch to Pinata for better reliability
            imageUrl = imageUrl.replace('https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs/');
          }
          
          // For evolved NFTs, if we still have a placeholder URL, construct the actual URL
          if (imageUrl.includes('placeholder.webp') && metadataId) {
            // Use the WebP version of evolved NFTs
            imageUrl = `https://plum-defeated-leopon-866.mypinata.cloud/ipfs/bafybeic7kknhjbvdrrkzlthi7zvqg7ilxeeckcq3d7y54qv3xngiw2pjui/nfts/${metadataId}.webp`;
            console.log('Constructed evolved image URL:', imageUrl);
          }
          
          return (
            <div key={objectId} className="bg-white rounded-lg shadow-md overflow-hidden border-4 border-yellow-500">
              <div className="aspect-square bg-gray-100 relative">
                <a 
                  href={`https://suivision.xyz/object/${objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </a>
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold pointer-events-none">
                  EVOLVED
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-b from-yellow-50 to-white">
                <h3 className="font-bold text-lg mb-2">{name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Number: #{number}</p>
                  <p className="text-black">Metadata ID: {metadataId}</p>
                  <p>Original Artifact: #{originalArtifactNumber}</p>
                  {originalPath !== undefined && (
                    <p>Heritage: {CONTRACT_CONSTANTS.PATHS[parseInt(originalPath)]}</p>
                  )}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  This is a rare THE SUDOZ NFT, obtained by burning a level 10 artifact
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}