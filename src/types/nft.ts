export interface SudozArtifact {
  id: string;
  name: string;
  description: string;
  image_url: string;
  number: number;
  level: number;
  points: number;
  path?: number;
}

export interface EvolvedSudoz {
  id: string;
  name: string;
  description: string;
  image_url: string;
  number: number;
  metadata_id: number;
  original_artifact_number: number;
  original_path: number;
  // On-chain traits
  background: string;
  skin: string;
  clothes: string;
  hats: string;
  eyewear: string;
  mouth: string;
  earrings: string;
}

export interface GlobalStats {
  artifacts_minted: number;
  artifacts_burned: number;
  upgrade_fees: string;
  level_10_burns: number;
  burn_mechanisms_enabled: boolean;
}

export interface EvolvedStats {
  evolved_minted: number;
  available_metadata_ids: number[];
  royalty_fees: string;
}