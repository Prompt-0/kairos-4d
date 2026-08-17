import { describe, it, expect } from 'vitest';
import { CAUSALITY_ACTIONS, getAvailableCausalityActions } from '../engine/causalityRules';
import { CLUES } from '../engine/storyData';

describe('KAIROS 4D — Causality Engine', () => {
  it('should list all defined 1926 causality actions when uncompleted', () => {
    const available = getAvailableCausalityActions('1926', []);
    expect(available.length).toBeGreaterThanOrEqual(4);
    expect(available.some(a => a.id === 'action_calibrate_escapement_1926')).toBe(true);
    expect(available.some(a => a.id === 'action_nourish_orchid_1926')).toBe(true);
    expect(available.some(a => a.id === 'action_solve_vault_cipher_1926')).toBe(true);
    expect(available.some(a => a.id === 'action_inscribe_bench_1926')).toBe(true);
  });

  it('should filter out completed actions', () => {
    const available = getAvailableCausalityActions('1926', ['action_calibrate_escapement_1926']);
    expect(available.some(a => a.id === 'action_calibrate_escapement_1926')).toBe(false);
  });

  it('should verify each causality action has valid target unlocked clue IDs', () => {
    Object.values(CAUSALITY_ACTIONS).forEach(action => {
      expect(action.sourceEra).toBe('1926');
      action.rippleEffects.forEach(effect => {
        expect(['2026', '2156']).toContain(effect.targetEra);
        if (effect.unlockedClueId) {
          expect(CLUES[effect.unlockedClueId]).toBeDefined();
        }
      });
    });
  });
});
