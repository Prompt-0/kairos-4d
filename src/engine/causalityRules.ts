import { EraId } from './types';

export interface CausalityAction {
  id: string;
  name: string;
  sourceEra: EraId;
  description: string;
  requiredClueOrItemId?: string;
  rippleEffects: {
    targetEra: EraId;
    summary: string;
    unlockedClueId?: string;
    visualChangeDescription: string;
  }[];
}

export const CAUSALITY_ACTIONS: Record<string, CausalityAction> = {
  action_calibrate_escapement_1926: {
    id: 'action_calibrate_escapement_1926',
    name: 'Calibrate Astronomical Clockwork Escapement',
    sourceEra: '1926',
    description: 'Use the precision jeweler\'s wrench to tune the 1926 grandfather clock gear ratio to 1.042 Hz.',
    rippleEffects: [
      {
        targetEra: '2026',
        summary: 'In 2026, the harmonic resonance opens a concealed mahogany compartment behind the clock face!',
        unlockedClueId: 'clue_hidden_diary_page',
        visualChangeDescription: 'The 2026 grandfather clock has a popped-open secret panel revealing Vance\'s personal journal.',
      },
      {
        targetEra: '2156',
        summary: 'In 2156, the tachyon storm stabilizes into a coherent resonance field, exposing the Quantum Trigger!',
        unlockedClueId: 'clue_tachyon_trigger',
        visualChangeDescription: 'The violent purple vortex slows into a crystalline standing wave holding the trigger device.',
      },
    ],
  },
  action_nourish_orchid_1926: {
    id: 'action_nourish_orchid_1926',
    name: 'Water the Lunar Orchid with Ionized Copper Solution',
    sourceEra: '1926',
    description: 'Feed the rare orchid sapling in the 1926 conservatory with specialized mineral elixir.',
    rippleEffects: [
      {
        targetEra: '2026',
        summary: 'In 2026, the centennial orchid has grown into a colossal 12-foot bioluminescent bloom with rich curative nectar!',
        unlockedClueId: 'clue_orchid_poison_sample',
        visualChangeDescription: 'Massive glowing indigo petals illuminate the 2026 conservatory glass dome.',
      },
      {
        targetEra: '2156',
        summary: 'In 2156, the petrified tree\'s bio-luminescent fiber network awakens, yielding the Botanical Memory Core!',
        unlockedClueId: 'clue_botanical_memory_chip',
        visualChangeDescription: 'Glowing emerald and violet data pulses race through the cyber-tree trunk.',
      },
    ],
  },
  action_solve_vault_cipher_1926: {
    id: 'action_solve_vault_cipher_1926',
    name: 'Align Planetary Vault Dials (Mars 082°, Jupiter 247°, Venus 315°)',
    sourceEra: '1926',
    description: 'Rotate the heavy brass astronomical tumblers in the 1926 study to the celestial conjunction.',
    rippleEffects: [
      {
        targetEra: '2026',
        summary: 'In 2026, the time-locked alloy safe unlocks automatically, exposing Silas Thorne\'s stolen patent contract!',
        unlockedClueId: 'clue_vault_patent_contract',
        visualChangeDescription: 'The biometric safe in 2026 clicks open with green authentication lasers.',
      },
      {
        targetEra: '2156',
        summary: 'In 2156, the breached vault reveals Dr. Vance\'s pristine holographic farewell log!',
        unlockedClueId: 'clue_vance_final_log',
        visualChangeDescription: 'A volumetric blue hologram of Dr. Vance flickers into life in the center of the vault.',
      },
    ],
  },
  action_inscribe_bench_1926: {
    id: 'action_inscribe_bench_1926',
    name: 'Inscribe Temporal Encryption Glyph on Garden Bench',
    sourceEra: '1926',
    description: 'Chisel a sacred chronal glyph onto the conservatory stone bench.',
    rippleEffects: [
      {
        targetEra: '2026',
        summary: 'In 2026, UV forensic analysis highlights the hidden palimpsest text underneath the weathered stone!',
        unlockedClueId: 'clue_uv_hidden_signature',
        visualChangeDescription: 'Ultraviolet glow reveals the glowing hidden message across the stone armrest.',
      },
      {
        targetEra: '2156',
        summary: 'In 2156, the cyber obelisk decodes the glyph, unlocking the full trans-temporal genealogy paradox matrix!',
        unlockedClueId: 'clue_genealogy_hologram',
        visualChangeDescription: 'The cyber obelisk projects an intricate multi-generational genealogy tree.',
      },
    ],
  },
};

export function getAvailableCausalityActions(currentEra: EraId, completedActionIds: string[]): CausalityAction[] {
  return Object.values(CAUSALITY_ACTIONS).filter(
    action => action.sourceEra === currentEra && !completedActionIds.includes(action.id)
  );
}
