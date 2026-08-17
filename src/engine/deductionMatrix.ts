import { DEDUCTION_HYPOTHESES } from './storyData';
import { DeductionHypothesis } from './types';

export interface EvaluationResult {
  isMatch: boolean;
  matchedHypothesis?: DeductionHypothesis;
  alreadySolved: boolean;
  message: string;
}

export function evaluateDeductionLinks(
  selectedClueIds: string[],
  solvedDeductionIds: string[]
): EvaluationResult {
  if (selectedClueIds.length < 2) {
    return {
      isMatch: false,
      alreadySolved: false,
      message: 'Select at least 2 related clues to synthesize a hypothesis.',
    };
  }

  // Find hypothesis where all required clue IDs are contained in selectedClueIds
  const matched = DEDUCTION_HYPOTHESES.find(hypo => {
    return hypo.requiredClueIds.every(id => selectedClueIds.includes(id));
  });

  if (!matched) {
    return {
      isMatch: false,
      alreadySolved: false,
      message: 'No causal breakthrough detected from these connected clues. Check timeline correlations and inspect clue details.',
    };
  }

  if (solvedDeductionIds.includes(matched.id)) {
    return {
      isMatch: true,
      matchedHypothesis: matched,
      alreadySolved: true,
      message: `Hypothesis already synthesized: "${matched.title}".`,
    };
  }

  return {
    isMatch: true,
    matchedHypothesis: matched,
    alreadySolved: false,
    message: `EUREKA! Causal deduction breakthrough: ${matched.title}!`,
  };
}

export function calculateTimelineStability(solvedDeductionIds: string[]): number {
  const total = DEDUCTION_HYPOTHESES.reduce((acc, h) => {
    return solvedDeductionIds.includes(h.id) ? acc + h.stabilityImpact : acc;
  }, 0);
  return Math.min(100, total);
}

export function isGrandParadoxUnlocked(solvedDeductionIds: string[]): boolean {
  return DEDUCTION_HYPOTHESES.every(h => solvedDeductionIds.includes(h.id));
}
