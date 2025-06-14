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
  // TESTNET Deployment - KIOSK-INTEGRATED VERSION WITH FULL MARKETPLACE SUPPORT
  PACKAGE_ID: '0xfe1b4b8aa749be78e4adff15432b22b0f0efd8c9ab74b002fe1bbcf2e5d80b02',
  ADMIN_CAP_ID: '0x10dd76db14a46c1bd96a5e0fe3312328369fbdb06f14c1f741be2ab46be7e7a7', // Dev AdminCap (owned by deployer)
  DEV_ADMIN_CAP_ID: '0x10dd76db14a46c1bd96a5e0fe3312328369fbdb06f14c1f741be2ab46be7e7a7', // Dev AdminCap
  FOUNDER_ADMIN_CAP_ID: '0xdb9cab65b99a68967eff308582cb30480e301610a56f710f3536e9fe9038284f', // Founder AdminCap
  GLOBAL_STATS_ID: '0x9f7f49bb47bf6f016d891e5aefc79bd36f4734f813dbbbb824a88fdb21559b13', // GlobalStats
  RANDOM_OBJECT_ID: '0x8',
  MODULE_NAME: 'sudoz_artifacts_v2',
  EVOLVED_MODULE_NAME: 'evolved_sudoz',
  
  // EVOLVED SUDOZ Contract IDs - KIOSK-INTEGRATED
  EVOLVED_ADMIN_CAP_ID: '0x9791770f3162ace6e143778b3efa94b3c90399726457f0e55bc5f35a9593ee0c', // EvolvedAdminCap
  EVOLVED_STATS_ID: '0x8756b62b9a94690e6935f53815ce20425a4654b0b950953e16eba683a6f5b5a5', // EvolvedStats
  TRANSFER_POLICY_ID: '0x368c81b2ba8d2634b9617fcab6eea9876589805f2e91f2ecd2a4f24bd83bc46f', // TransferPolicy
  TRANSFER_POLICY_CAP_ID: '0x2608d6dbb6f063785fb0f65dd0f9e25cc2df4d330c9d57b642c70c42a1deeb91', // TransferPolicyCap
  EVOLUTION_AUTH_ID: '0x189e55c7793ee65a70ebd56599d51d16c7db76f53acce4438354263f36629c0e', // EvolutionAuth
  
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

