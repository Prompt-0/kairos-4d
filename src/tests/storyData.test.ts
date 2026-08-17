import { describe, it, expect } from 'vitest';
import { ERAS, ROOMS, HOTSPOTS, CLUES, DEDUCTION_HYPOTHESES, ENDINGS } from '../engine/storyData';

describe('KAIROS 4D — Story Data & Integrity Audit', () => {
  it('should have 3 distinct eras defined with proper metadata', () => {
    expect(Object.keys(ERAS)).toEqual(['1926', '2026', '2156']);
  });

  it('should have 4 rooms defined with descriptions for all 3 eras', () => {
    const roomIds = Object.keys(ROOMS);
    expect(roomIds).toEqual(['atrium', 'laboratory', 'study', 'conservatory']);
    roomIds.forEach(id => {
      expect(ROOMS[id].descriptionByEra['1926']).toBeDefined();
      expect(ROOMS[id].descriptionByEra['2026']).toBeDefined();
      expect(ROOMS[id].descriptionByEra['2156']).toBeDefined();
    });
  });

  it('should verify all clues in hotspots exist in CLUES dictionary', () => {
    HOTSPOTS.forEach(hs => {
      if (hs.unlockedClueIdByEra) {
        Object.values(hs.unlockedClueIdByEra).forEach(clueId => {
          expect(CLUES[clueId], `Clue ${clueId} should exist in CLUES`).toBeDefined();
        });
      }
    });
  });

  it('should verify all deduction hypotheses reference valid clues', () => {
    DEDUCTION_HYPOTHESES.forEach(hypo => {
      hypo.requiredClueIds.forEach(clueId => {
        expect(CLUES[clueId], `Clue ${clueId} in hypothesis ${hypo.id} should exist`).toBeDefined();
      });
      if (hypo.unlockedClueId) {
        expect(CLUES[hypo.unlockedClueId], `Reward clue ${hypo.unlockedClueId} should exist`).toBeDefined();
      }
    });
  });

  it('should verify all 4 branching endings exist', () => {
    expect(ENDINGS.master_detective).toBeDefined();
    expect(ENDINGS.entropy_fracture).toBeDefined();
    expect(ENDINGS.alchemical_ascendance).toBeDefined();
    expect(ENDINGS.singularity).toBeDefined();
  });
});
