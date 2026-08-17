import { useState, useEffect } from 'react';
import { EraId, RoomId, Clue, Hotspot, PinboardNode, PinboardLink } from './types';
import { CLUES } from './storyData';
import { CAUSALITY_ACTIONS } from './causalityRules';
import { evaluateDeductionLinks, calculateTimelineStability } from './deductionMatrix';
import { soundEngine } from '../audio/SoundEngine';

const STORAGE_KEY = 'KAIROS_4D_SAVE_V1';

export interface GameState {
  currentEra: EraId;
  currentRoomId: RoomId;
  unlockedClueIds: string[];
  completedActionIds: string[];
  solvedDeductionIds: string[];
  pinboardNodes: PinboardNode[];
  pinboardLinks: PinboardLink[];
  selectedPinboardNodeIds: string[];
  activeTab: 'investigate' | 'evidence_board' | 'interrogate' | 'forensics' | 'vault' | 'guide';
  activeSuspectId: string;
  selectedSpectrometryClueId: string | null;
  inspectedClue: Clue | null;
  inspectedHotspot: Hotspot | null;
  timelineStability: number;
  isGameFinished: boolean;
  chosenEndingId: string | null;
  soundMuted: boolean;
  lastToast: { message: string; type: 'info' | 'success' | 'warning' | 'eureka' } | null;
}

const INITIAL_CLUES = [
  'clue_clockwork_escapement',
  'clue_blue_elixir_drop',
  'clue_autopsy_report',
  'clue_warning_letter',
];

const INITIAL_STATE: GameState = {
  currentEra: '1926',
  currentRoomId: 'atrium',
  unlockedClueIds: INITIAL_CLUES,
  completedActionIds: [],
  solvedDeductionIds: [],
  pinboardNodes: [
    { id: 'node_clue_clockwork_escapement', type: 'clue', refId: 'clue_clockwork_escapement', x: 120, y: 140 },
    { id: 'node_clue_blue_elixir_drop', type: 'clue', refId: 'clue_blue_elixir_drop', x: 120, y: 280 },
    { id: 'node_clue_autopsy_report', type: 'clue', refId: 'clue_autopsy_report', x: 420, y: 140 },
    { id: 'node_clue_warning_letter', type: 'clue', refId: 'clue_warning_letter', x: 420, y: 280 },
  ],
  pinboardLinks: [],
  selectedPinboardNodeIds: [],
  activeTab: 'investigate',
  activeSuspectId: 'eleanor_vance',
  selectedSpectrometryClueId: 'clue_clockwork_escapement',
  inspectedClue: null,
  inspectedHotspot: null,
  timelineStability: 0,
  isGameFinished: false,
  chosenEndingId: null,
  soundMuted: false,
  lastToast: { message: 'Temporal Investigation Initialized. Era: 1926.', type: 'info' },
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_STATE, ...parsed };
      }
    } catch {
      // Ignore corrupted save
    }
    return INITIAL_STATE;
  });

  // Autosave
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'eureka' = 'info') => {
    setState(prev => ({ ...prev, lastToast: { message, type } }));
  };

  const switchEra = (newEra: EraId) => {
    soundEngine.switchEra(newEra);
    setState(prev => ({
      ...prev,
      currentEra: newEra,
      lastToast: { message: `Time-shifted to Era ${newEra}`, type: 'info' },
    }));
  };

  const switchRoom = (roomId: RoomId) => {
    setState(prev => ({ ...prev, currentRoomId: roomId }));
  };

  const setTab = (tab: GameState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const unlockClue = (clueId: string) => {
    if (!CLUES[clueId]) return;
    setState(prev => {
      if (prev.unlockedClueIds.includes(clueId)) return prev;

      soundEngine.playClueDiscoveredSFX();
      const newUnlocked = [...prev.unlockedClueIds, clueId];
      
      // Auto-add to pinboard if not present
      const nodeId = `node_${clueId}`;
      const existing = prev.pinboardNodes.find(n => n.id === nodeId);
      const newNodes = existing
        ? prev.pinboardNodes
        : [
            ...prev.pinboardNodes,
            {
              id: nodeId,
              type: 'clue' as const,
              refId: clueId,
              x: 100 + (newUnlocked.length % 5) * 160,
              y: 100 + Math.floor(newUnlocked.length / 5) * 160,
            },
          ];

      return {
        ...prev,
        unlockedClueIds: newUnlocked,
        pinboardNodes: newNodes,
        lastToast: {
          message: `🔍 New Clue Discovered: "${CLUES[clueId].title}"`,
          type: 'success',
        },
      };
    });
  };

  const executeCausalityAction = (actionId: string) => {
    const action = CAUSALITY_ACTIONS[actionId];
    if (!action) return;

    soundEngine.playEurekaFanfare();

    setState(prev => {
      if (prev.completedActionIds.includes(actionId)) return prev;

      const newCompleted = [...prev.completedActionIds, actionId];
      const newlyUnlockedClues = [...prev.unlockedClueIds];

      action.rippleEffects.forEach(effect => {
        if (effect.unlockedClueId && !newlyUnlockedClues.includes(effect.unlockedClueId)) {
          newlyUnlockedClues.push(effect.unlockedClueId);
        }
      });

      return {
        ...prev,
        completedActionIds: newCompleted,
        unlockedClueIds: newlyUnlockedClues,
        lastToast: {
          message: `⚡ Causality Ripple Triggered! Past altered: ${action.name}`,
          type: 'eureka',
        },
      };
    });
  };

  const togglePinboardNodeSelection = (nodeId: string) => {
    soundEngine.playPinboardLinkSFX();
    setState(prev => {
      const selected = prev.selectedPinboardNodeIds.includes(nodeId)
        ? prev.selectedPinboardNodeIds.filter(id => id !== nodeId)
        : [...prev.selectedPinboardNodeIds, nodeId];
      return { ...prev, selectedPinboardNodeIds: selected };
    });
  };

  const linkPinboardNodes = (fromNodeId: string, toNodeId: string) => {
    soundEngine.playPinboardLinkSFX();
    setState(prev => {
      const exists = prev.pinboardLinks.some(
        l =>
          (l.fromNodeId === fromNodeId && l.toNodeId === toNodeId) ||
          (l.fromNodeId === toNodeId && l.toNodeId === fromNodeId)
      );
      if (exists) return prev;

      const newLink: PinboardLink = {
        id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        fromNodeId,
        toNodeId,
      };

      return {
        ...prev,
        pinboardLinks: [...prev.pinboardLinks, newLink],
      };
    });
  };

  const synthesizeHypothesisFromSelection = () => {
    const selectedClues = state.selectedPinboardNodeIds
      .map(nodeId => {
        const node = state.pinboardNodes.find(n => n.id === nodeId);
        return node?.refId;
      })
      .filter((id): id is string => !!id);

    const evalResult = evaluateDeductionLinks(selectedClues, state.solvedDeductionIds);

    if (evalResult.isMatch && evalResult.matchedHypothesis && !evalResult.alreadySolved) {
      soundEngine.playEurekaFanfare();
      const hypo = evalResult.matchedHypothesis;

      setState(prev => {
        const newSolved = [...prev.solvedDeductionIds, hypo.id];
        const newStability = calculateTimelineStability(newSolved);
        const newUnlockedClues = hypo.unlockedClueId && !prev.unlockedClueIds.includes(hypo.unlockedClueId)
          ? [...prev.unlockedClueIds, hypo.unlockedClueId]
          : prev.unlockedClueIds;

        return {
          ...prev,
          solvedDeductionIds: newSolved,
          unlockedClueIds: newUnlockedClues,
          timelineStability: newStability,
          selectedPinboardNodeIds: [],
          lastToast: {
            message: `✨ EUREKA! Deduction Unlocked: ${hypo.title}`,
            type: 'eureka',
          },
        };
      });
      return evalResult;
    } else {
      showToast(evalResult.message, evalResult.alreadySolved ? 'warning' : 'info');
      return evalResult;
    }
  };

  const updatePinboardNodePosition = (nodeId: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      pinboardNodes: prev.pinboardNodes.map(n => (n.id === nodeId ? { ...n, x, y } : n)),
    }));
  };

  const selectSpectrometryClue = (clueId: string) => {
    soundEngine.playScanSFX();
    setState(prev => ({ ...prev, selectedSpectrometryClueId: clueId }));
  };

  const setInspectedClue = (clue: Clue | null) => {
    if (clue) soundEngine.playPinboardLinkSFX();
    setState(prev => ({ ...prev, inspectedClue: clue }));
  };

  const setInspectedHotspot = (hotspot: Hotspot | null) => {
    if (hotspot) soundEngine.playPinboardLinkSFX();
    setState(prev => ({ ...prev, inspectedHotspot: hotspot }));
  };

  const triggerEnding = (endingId: string) => {
    soundEngine.playEurekaFanfare();
    setState(prev => ({
      ...prev,
      isGameFinished: true,
      chosenEndingId: endingId,
      lastToast: { message: 'Grand Paradox Concluded.', type: 'eureka' },
    }));
  };

  const toggleSound = () => {
    const nextMuted = !state.soundMuted;
    soundEngine.setMuted(nextMuted);
    setState(prev => ({ ...prev, soundMuted: nextMuted }));
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  };

  return {
    state,
    switchEra,
    switchRoom,
    setTab,
    unlockClue,
    executeCausalityAction,
    togglePinboardNodeSelection,
    linkPinboardNodes,
    synthesizeHypothesisFromSelection,
    updatePinboardNodePosition,
    selectSpectrometryClue,
    setInspectedClue,
    setInspectedHotspot,
    triggerEnding,
    toggleSound,
    resetGame,
    showToast,
  };
}
