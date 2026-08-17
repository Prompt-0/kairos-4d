import React, { useEffect } from 'react';
import { useGameState } from './engine/gameState';
import { Header } from './components/Header';
import { EraSwitcher } from './components/EraSwitcher';
import { RoomView } from './components/RoomView';
import { EvidenceBoard } from './components/EvidenceBoard';
import { InterrogationView } from './components/InterrogationView';
import { ForensicsLab } from './components/ForensicsLab';
import { VaultView } from './components/VaultView';
import { HelpGuide } from './components/HelpGuide';
import { ClueInspectModal } from './components/ClueInspectModal';
import { EndingModal } from './components/EndingModal';
import { soundEngine } from './audio/SoundEngine';
import { Info, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const {
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
    triggerEnding,
    toggleSound,
    resetGame,
    showToast,
  } = useGameState();

  // Initialize Web Audio on first user interaction
  useEffect(() => {
    const handleFirstClick = () => {
      soundEngine.init();
      window.removeEventListener('click', handleFirstClick);
      window.removeEventListener('keydown', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    window.addEventListener('keydown', handleFirstClick);
    return () => {
      window.removeEventListener('click', handleFirstClick);
      window.removeEventListener('keydown', handleFirstClick);
    };
  }, []);

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case 'investigate':
        return (
          <RoomView
            currentEra={state.currentEra}
            currentRoomId={state.currentRoomId}
            onSwitchRoom={switchRoom}
            unlockedClueIds={state.unlockedClueIds}
            completedActionIds={state.completedActionIds}
            onUnlockClue={unlockClue}
            onExecuteCausalityAction={executeCausalityAction}
            onInspectClue={setInspectedClue}
          />
        );
      case 'evidence_board':
        return (
          <EvidenceBoard
            unlockedClueIds={state.unlockedClueIds}
            pinboardNodes={state.pinboardNodes}
            pinboardLinks={state.pinboardLinks}
            selectedNodeIds={state.selectedPinboardNodeIds}
            solvedDeductionIds={state.solvedDeductionIds}
            onToggleSelectNode={togglePinboardNodeSelection}
            onLinkNodes={linkPinboardNodes}
            onSynthesizeHypothesis={synthesizeHypothesisFromSelection}
            onUpdateNodePos={updatePinboardNodePosition}
            onInspectClue={setInspectedClue}
          />
        );
      case 'interrogate':
        return (
          <InterrogationView
            currentEra={state.currentEra}
            activeSuspectId={state.activeSuspectId}
            unlockedClueIds={state.unlockedClueIds}
            onSelectSuspect={id => {
              state.activeSuspectId = id;
            }}
            onUnlockClue={unlockClue}
            showToast={showToast}
          />
        );
      case 'forensics':
        return (
          <ForensicsLab
            currentEra={state.currentEra}
            unlockedClueIds={state.unlockedClueIds}
            selectedClueId={state.selectedSpectrometryClueId}
            onSelectClue={selectSpectrometryClue}
            onExecuteCausalityAction={executeCausalityAction}
            completedActionIds={state.completedActionIds}
            showToast={showToast}
          />
        );
      case 'vault':
        return (
          <VaultView
            solvedDeductionIds={state.solvedDeductionIds}
            timelineStability={state.timelineStability}
            onTriggerEnding={triggerEnding}
          />
        );
      case 'guide':
        return <HelpGuide />;
      default:
        return null;
    }
  };

  const getToastIcon = (type?: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-400 shrink-0" />;
      case 'eureka': return <Sparkles size={16} className="text-purple-400 shrink-0 animate-spin" />;
      default: return <Info size={16} className="text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header
        currentEra={state.currentEra}
        timelineStability={state.timelineStability}
        activeTab={state.activeTab}
        onTabChange={setTab}
        soundMuted={state.soundMuted}
        onToggleSound={toggleSound}
        onResetGame={resetGame}
        solvedCount={state.solvedDeductionIds.length}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col gap-2 pb-8">
        {/* Era Switcher Bar (Always accessible for rapid time navigation) */}
        <EraSwitcher
          currentEra={state.currentEra}
          onSwitchEra={switchEra}
          completedActionCount={state.completedActionIds.length}
        />

        {/* Dynamic View Tab */}
        {renderActiveTab()}
      </main>

      {/* Bottom Floating Toast Notification */}
      {state.lastToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-warp">
          <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2.5 text-xs text-neutral-100 font-medium">
            {getToastIcon(state.lastToast.type)}
            <span>{state.lastToast.message}</span>
          </div>
        </div>
      )}

      {/* Clue Inspector Modal */}
      <ClueInspectModal
        clue={state.inspectedClue}
        onClose={() => setInspectedClue(null)}
        onOpenInSpectrometer={clueId => {
          selectSpectrometryClue(clueId);
          setTab('forensics');
        }}
      />

      {/* Grand Ending Modal */}
      {state.isGameFinished && (
        <EndingModal
          endingId={state.chosenEndingId}
          onRestart={resetGame}
        />
      )}
    </div>
  );
};
