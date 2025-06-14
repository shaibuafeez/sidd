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
  // TESTNET Deployment - EVOLUTION-ENABLED VERSION WITH FULL KIOSK INTEGRATION
  PACKAGE_ID: '0x257ce01a8f4ca50b04a2f0e3965043743ec7a1171bc6e9d99ebe291375ea8e09',
  ADMIN_CAP_ID: '0xe20fb3dda7e93572d1b28b8564b533fbe4fe13f086503aab4781320cbd496acd', // Dev AdminCap (owned by deployer)
  DEV_ADMIN_CAP_ID: '0xe20fb3dda7e93572d1b28b8564b533fbe4fe13f086503aab4781320cbd496acd', // Dev AdminCap
  FOUNDER_ADMIN_CAP_ID: '0x7cbc4eab028bbdfac61fd95466a275ccf9bcca86ea4b5ee94629c7ca1e7d8a46', // Founder AdminCap
  GLOBAL_STATS_ID: '0xa53f4140be05a5f882954ff4db6463689434afdfc2ed4e5171d3d37f881bb6ff', // GlobalStats
  RANDOM_OBJECT_ID: '0x8',
  MODULE_NAME: 'sudoz_artifacts_v2',
  EVOLVED_MODULE_NAME: 'evolved_sudoz',
  
  // EVOLVED SUDOZ Contract IDs - EVOLUTION-ENABLED VERSION
  EVOLVED_ADMIN_CAP_ID: '0x55f074f70818377795966bd078d3c84c52b4d19f205c5caf672411ff6b6d2ea0', // EvolvedAdminCap
  EVOLVED_STATS_ID: '0x8e6611eb20520add66506f9bb7f6c4923bf80d75f78369b9f2da9ca3b49bafc6', // EvolvedStats
  TRANSFER_POLICY_ID: '0x8ac88e8d90a53f65149282c18a80b1e4d359de9af2a5823eb706c9eed34a5eaa', // TransferPolicy
  TRANSFER_POLICY_CAP_ID: '0xafcc0a65a0522266e879d337b55874c47ccea9134c3151919a1ea99f5ef03326', // TransferPolicyCap
  EVOLUTION_AUTH_ID: 'wrapped_in_globalstats', // EvolutionAuth (now stored in GlobalStats)
  
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
    EVOLVE_ARTIFACT_WITH_POLICY: 'entry_evolve_artifact_with_policy',
    EVOLVE_ARTIFACT_TO_KIOSK: 'evolve_artifact_to_kiosk',
    GET_LEVEL: 'get_level',
    GET_POINTS: 'get_points',
    GET_NAME: 'get_name',
    GET_PATH: 'get_path',
    WITHDRAW_UPGRADE_FEES: 'withdraw_upgrade_fees',
    // Evolved module functions
    MINT_DEVELOPER_RESERVE_SPECIFIC: 'mint_developer_reserve_specific',
    MINT_DEVELOPER_RESERVE_BATCH: 'mint_developer_reserve_batch',
    MINT_DEVELOPER_RESERVE_ONE_OF_ONES: 'mint_developer_reserve_one_of_ones',
    // Kiosk functions
    PLACE_IN_KIOSK: 'place_in_kiosk',
    LIST_FOR_SALE: 'list_for_sale',
    PURCHASE_FROM_KIOSK: 'purchase_from_kiosk',
    DELIST_FROM_KIOSK: 'delist_from_kiosk',
    TAKE_FROM_KIOSK: 'take_from_kiosk',
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

