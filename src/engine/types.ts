/**
 * KAIROS 4D: Domain Type Definitions
 */

export type EraId = '1926' | '2026' | '2156';

export interface EraInfo {
  id: EraId;
  name: string;
  subtitle: string;
  year: number;
  themeColor: string;
  secondaryColor: string;
  fontFamily: string;
  description: string;
  techLevel: string;
}

export type RoomId = 'atrium' | 'laboratory' | 'study' | 'conservatory';

export interface RoomInfo {
  id: RoomId;
  name: string;
  iconName: string;
  descriptionByEra: Record<EraId, string>;
}

export interface Hotspot {
  id: string;
  roomId: RoomId;
  nameByEra: Record<EraId, string>;
  descriptionByEra: Record<EraId, string>;
  icon: string;
  xPercent: number; // Position on 2.5D room canvas
  yPercent: number;
  unlockedClueIdByEra?: Partial<Record<EraId, string>>;
  actionRequired?: {
    id: string;
    label: string;
    targetEra: EraId;
    actionType: 'examine' | 'modify_past' | 'spectrometry' | 'cipher';
    requiredItemId?: string;
    successMessage: string;
  };
}

export type ClueCategory = 'physical' | 'forensic' | 'document' | 'paradox' | 'testimony';

export interface Clue {
  id: string;
  title: string;
  era: EraId;
  category: ClueCategory;
  description: string;
  icon: string;
  details: string;
  spectrometryData?: {
    optical: string;
    infrared: string;
    tachyon: string;
    tachyonAgeYears: number;
    entanglementLevel: number;
  };
}

export interface Suspect {
  id: string;
  nameByEra: Record<EraId, string>;
  roleByEra: Record<EraId, string>;
  portraitUrlByEra: Record<EraId, string>;
  bioByEra: Record<EraId, string>;
  stressLevel: number; // 0 to 100
  alibiByEra: Record<EraId, string>;
  contradictionClueIdByEra?: Partial<Record<EraId, string>>;
  confessionTextByEra?: Partial<Record<EraId, string>>;
  dialogueNodes: DialogueNode[];
}

export interface DialogueNode {
  id: string;
  era: EraId;
  prompt: string;
  response: string;
  unlockedByClueId?: string;
  unlocksClueId?: string;
  stressDelta?: number;
}

export interface PinboardNode {
  id: string;
  type: 'clue' | 'suspect' | 'deduction';
  refId: string;
  x: number;
  y: number;
}

export interface PinboardLink {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  isParadoxLink?: boolean;
}

export interface DeductionHypothesis {
  id: string;
  title: string;
  summary: string;
  requiredClueIds: string[];
  unlockedClueId?: string;
  stabilityImpact: number; // % toward paradox resolution
  narrativeRevelation: string;
  chapter: number;
}

export interface CausalityMutation {
  id: string;
  triggerActionId: string;
  sourceEra: EraId;
  affectedEras: EraId[];
  title: string;
  description: string;
  modifiedHotspotIds: string[];
}

export interface GameEnding {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  alignment: 'master_detective' | 'entropy_fracture' | 'alchemical_ascendance' | 'singularity';
  quote: string;
}
