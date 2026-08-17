import { describe, it, expect } from 'vitest';
import { evaluateDeductionLinks, calculateTimelineStability, isGrandParadoxUnlocked } from '../engine/deductionMatrix';
import { DEDUCTION_HYPOTHESES } from '../engine/storyData';

describe('KAIROS 4D — Deduction Matrix & Hypothesis Evaluator', () => {
  it('should reject combinations with fewer than 2 clues', () => {
    const result = evaluateDeductionLinks(['clue_clockwork_escapement'], []);
    expect(result.isMatch).toBe(false);
    expect(result.message).toContain('at least 2');
  });

  it('should reject unrelated clue combinations', () => {
    const result = evaluateDeductionLinks(['clue_clockwork_escapement', 'clue_chisel_dedication'], []);
    expect(result.isMatch).toBe(false);
    expect(result.message).toContain('No causal breakthrough');
  });

  it('should successfully match Chapter 1 Tri-Temporal Weapon deduction', () => {
    const result = evaluateDeductionLinks(
      ['clue_clockwork_escapement', 'clue_autopsy_report', 'clue_tachyon_trigger'],
      []
    );
    expect(result.isMatch).toBe(true);
    expect(result.alreadySolved).toBe(false);
    expect(result.matchedHypothesis?.id).toBe('deduction_1_murder_weapon');
    expect(result.message).toContain('EUREKA');
  });

  it('should indicate when a hypothesis is already solved', () => {
    const result = evaluateDeductionLinks(
      ['clue_clockwork_escapement', 'clue_autopsy_report', 'clue_tachyon_trigger'],
      ['deduction_1_murder_weapon']
    );
    expect(result.isMatch).toBe(true);
    expect(result.alreadySolved).toBe(true);
    expect(result.message).toContain('already synthesized');
  });

  it('should calculate accurate timeline stability percentages', () => {
    expect(calculateTimelineStability([])).toBe(0);
    expect(calculateTimelineStability(['deduction_1_murder_weapon'])).toBe(25);
    expect(calculateTimelineStability(['deduction_1_murder_weapon', 'deduction_2_poison_premeditation'])).toBe(50);
    expect(
      calculateTimelineStability([
        'deduction_1_murder_weapon',
        'deduction_2_poison_premeditation',
        'deduction_3_patent_conspiracy',
        'deduction_4_true_identity',
      ])
    ).toBe(100);
  });

  it('should verify Grand Paradox unlocks only when all 4 deductions are solved', () => {
    const allIds = DEDUCTION_HYPOTHESES.map(h => h.id);
    expect(isGrandParadoxUnlocked(allIds.slice(0, 3))).toBe(false);
    expect(isGrandParadoxUnlocked(allIds)).toBe(true);
  });
});
