// Revenue split configuration
export const REVENUE_CONFIG = {
  DEV_PERCENTAGE: 15,
  FOUNDER_PERCENTAGE: 85,
  DEV_ADDRESS: '0x9a5b0ad3a18964ab7c0dbf9ab4cdecfd6b3899423b47313ae6e78f4b801022a3',
  FOUNDER_ADDRESS: '0xf1df42d3b603f6d22fc276c25dd1eee4c3f767d7a7e7ec36bf9c3d416a74e228',
  // Add deployer address for testing
  DEPLOYER_ADDRESS: '0x4822bfc9c86d1a77daf48b0bdf8f012ae9b7f8f01b4195dc0f3fd4fb838525bd',
};

export const CONTRACT_CONSTANTS = {
  // TESTNET Deployment - Updated Contract with evolution trait parameters
  PACKAGE_ID: '0x3ead3f49ccbb81a1ba1203955d1b0afde08f3a20598e346e9aa713b7af7ca644',
  ADMIN_CAP_ID: '0x1a756d2f22de69cad72594c8693b79776cc066fcdee94aed922b7e6de6132ed3', // Dev AdminCap (owned by deployer)
  DEV_ADMIN_CAP_ID: '0x1a756d2f22de69cad72594c8693b79776cc066fcdee94aed922b7e6de6132ed3', // Dev AdminCap
  GLOBAL_STATS_ID: '0xa3d0ae5f2e07c984e2041785f486df7e8d7165fb5600b5bc869bf12b4d91ed50', // GlobalStats
  RANDOM_OBJECT_ID: '0x8',
  MODULE_NAME: 'sudoz_artifacts_v2',
  EVOLVED_MODULE_NAME: 'evolved_sudoz',
  
  // EVOLVED SUDOZ Contract IDs
  EVOLVED_ADMIN_CAP_ID: '0x22f8c2025d3f9399f0fdd2dc438e7f3b9f2474026391aa4d35b974516e8b318f', // EvolvedAdminCap
  EVOLVED_STATS_ID: '0x6d51c1e20346222731b1e2b05bc1661152320d9c3ce1eb8e915e330561a80273', // EvolvedStats
  TRANSFER_POLICY_ID: '0x65317fbdf39553658a79a37654923e6d20c1a23dd76ea60da43a51e67bc0d5ac', // TransferPolicy
  
  // Revenue configuration
  REVENUE_CONFIG: REVENUE_CONFIG,
  
  // Function names
  FUNCTIONS: {
    MINT_ARTIFACT: 'mint_artifact',
    BATCH_MINT_ARTIFACTS: 'batch_mint_artifacts',
    UPGRADE_LEVEL: 'entry_upgrade_level',
    UPGRADE_TO_LEVEL: 'entry_upgrade_to_level',
    UPGRADE_TO_LEVEL_10: 'upgrade_to_level_10',
    EVOLVE_ARTIFACT: 'entry_evolve_artifact',
    GET_LEVEL: 'get_level',
    GET_POINTS: 'get_points',
    GET_NAME: 'get_name',
    GET_PATH: 'get_path',
    WITHDRAW_UPGRADE_FEES: 'withdraw_upgrade_fees',
    // Evolved module functions
    MINT_DEVELOPER_RESERVE_SPECIFIC: 'mint_developer_reserve_specific',
    MINT_DEVELOPER_RESERVE_BATCH: 'mint_developer_reserve_batch',
    MINT_DEVELOPER_RESERVE_ONE_OF_ONES: 'mint_developer_reserve_one_of_ones',
  },
  
  // Type names (will be set below)
  TYPES: {
    SUDOZ_ARTIFACT: '',
    EVOLVED_SUDOZ: '',
  },
  
  // Constants
  UPGRADE_COST_PER_LEVEL: 1_000_000_000, // 1 SUI in MIST
  MAX_LEVEL: 10,
  ARTIFACT_SUPPLY: 13600,
  EVOLVED_SUPPLY: 5555,
  DEVELOPER_RESERVE_TOTAL: 280,
  DEVELOPER_RESERVE_ONE_OF_ONES: 10,
  DEVELOPER_RESERVE_RANDOM: 270,
  MAX_BATCH_SIZE: 50,
  
  // 1/1 metadata IDs for developer reserve
  ONE_OF_ONE_IDS: [504, 998, 1529, 2016, 2530, 3022, 3533, 4059, 4555, 5190],
  
  // Path names
  PATHS: [
    'SUDO-A5 Frostbark',
    'SUDO-E8 Toxinpup',
    'SUDO-N0 Cryoblink',
    'SUDO-V9 Emberfang',
    'SUDO-X7 Glitchtail',
    'SUDO-Z1 Aurapup',
    'SUDO-Z3 Voidpaw',
  ],
};

// Fix the TYPES object
CONTRACT_CONSTANTS.TYPES = {
  SUDOZ_ARTIFACT: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::SudozArtifact`,
  EVOLVED_SUDOZ: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::EvolvedSudoz`,
};

