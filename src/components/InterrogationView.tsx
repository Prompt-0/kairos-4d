import React, { useState } from 'react';
import { EraId } from '../engine/types';
import { SUSPECTS, CLUES } from '../engine/storyData';
import { 
  MessageSquare, 
  AlertCircle, 
  ShieldAlert, 
  Flame, 
  Send, 
  HelpCircle
} from 'lucide-react';

interface InterrogationViewProps {
  currentEra: EraId;
  activeSuspectId: string;
  unlockedClueIds: string[];
  onSelectSuspect: (suspectId: string) => void;
  onUnlockClue: (clueId: string) => void;
  showToast: (msg: string, type?: any) => void;
}

export const InterrogationView: React.FC<InterrogationViewProps> = ({
  currentEra,
  activeSuspectId,
  unlockedClueIds,
  onSelectSuspect,
  onUnlockClue,
  showToast,
}) => {
  const [dialogueHistory, setDialogueHistory] = useState<
    Array<{ sender: 'detective' | 'suspect'; text: string; era: EraId }>
  >([]);
  const [confrontationTargetClueId, setConfrontationTargetClueId] = useState<string | null>(null);
  const [confessedSuspects, setConfessedSuspects] = useState<Record<string, boolean>>({});

  const suspect = SUSPECTS.find(s => s.id === activeSuspectId) || SUSPECTS[0];

  const handleAskQuestion = (prompt: string, response: string, unlocksClueId?: string) => {
    setDialogueHistory(prev => [
      ...prev,
      { sender: 'detective', text: prompt, era: currentEra },
      { sender: 'suspect', text: response, era: currentEra },
    ]);

    if (unlocksClueId) {
      onUnlockClue(unlocksClueId);
    }
  };

  const handleConfrontEvidence = () => {
    if (!confrontationTargetClueId) return;

    const targetContradiction = suspect.contradictionClueIdByEra?.[currentEra];

    if (confrontationTargetClueId === targetContradiction) {
      // Successful contradiction break!
      setConfessedSuspects(prev => ({ ...prev, [`${suspect.id}_${currentEra}`]: true }));
      const confession =
        suspect.confessionTextByEra?.[currentEra] ||
        'You have caught me in an impossible temporal contradiction...';

      setDialogueHistory(prev => [
        ...prev,
        {
          sender: 'detective',
          text: `[CONFRONTATION WITH ${CLUES[confrontationTargetClueId].title.toUpperCase()}]: Your testimony contradicts the timeline records!`,
          era: currentEra,
        },
        {
          sender: 'suspect',
          text: confession,
          era: currentEra,
        },
      ]);

      showToast(`🔥 Contradiction Broken! ${suspect.nameByEra[currentEra]} confessed!`, 'eureka');
    } else {
      setDialogueHistory(prev => [
        ...prev,
        {
          sender: 'detective',
          text: `Explain your connection to: ${CLUES[confrontationTargetClueId].title}`,
          era: currentEra,
        },
        {
          sender: 'suspect',
          text: 'That evidence proves nothing about my whereabouts in this era, Detective.',
          era: currentEra,
        },
      ]);
      showToast('No alibi contradiction triggered with this evidence.', 'info');
    }

    setConfrontationTargetClueId(null);
  };

  const hasConfessed = confessedSuspects[`${suspect.id}_${currentEra}`];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-col gap-4">
      {/* Suspect Selector Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {SUSPECTS.map(s => {
          const isSelected = s.id === activeSuspectId;
          const isConfessed = confessedSuspects[`${s.id}_${currentEra}`];

          return (
            <button
              key={s.id}
              onClick={() => onSelectSuspect(s.id)}
              className={`flex items-center gap-3 p-2.5 pr-4 rounded-2xl border text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? 'bg-neutral-800 border-cyan-500/60 shadow-lg text-white scale-[1.01]'
                  : 'bg-neutral-950/60 border-white/5 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <img
                src={s.portraitUrlByEra[currentEra]}
                alt={s.nameByEra[currentEra]}
                className="w-10 h-10 rounded-xl object-cover border border-white/10"
              />
              <div className="text-left">
                <div className="text-neutral-200 font-bold">{s.nameByEra[currentEra]}</div>
                <div className="text-[10px] text-neutral-400 font-normal">
                  {s.roleByEra[currentEra]}
                </div>
              </div>

              {isConfessed && (
                <span className="ml-2 text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/40">
                  CONFESSED
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interrogation Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Suspect Dossier & Stress Gauge */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            {/* Suspect Portrait & Header */}
            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/15 shadow-xl">
              <img
                src={suspect.portraitUrlByEra[currentEra]}
                alt={suspect.nameByEra[currentEra]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-base font-bold text-white leading-tight">
                  {suspect.nameByEra[currentEra]}
                </h3>
                <p className="text-xs text-cyan-300 font-medium">
                  {suspect.roleByEra[currentEra]}
                </p>
              </div>
            </div>

            {/* Suspect Bio */}
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs text-neutral-300 leading-relaxed">
              <span className="font-semibold text-neutral-200 block mb-1">Dossier Overview:</span>
              {suspect.bioByEra[currentEra]}
            </div>

            {/* Suspect Alibi */}
            <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <AlertCircle size={14} />
                <span>Recorded Alibi (Era {currentEra}):</span>
              </div>
              "{suspect.alibiByEra[currentEra]}"
            </div>
          </div>

          {/* Stress Meter */}
          <div className="bg-black/50 p-3 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Flame size={14} className={hasConfessed ? 'text-red-400 animate-bounce' : 'text-amber-400'} />
                <span>Suspect Tension / Stress:</span>
              </div>
              <span className="font-mono font-bold text-cyan-300">
                {hasConfessed ? '100%' : `${suspect.stressLevel}%`}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-500 ${
                  hasConfessed
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 to-red-500'
                }`}
                style={{ width: hasConfessed ? '100%' : `${suspect.stressLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dialogue Log & Interrogation Prompts */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-white/10 flex flex-col justify-between gap-4 min-h-[500px]">
          {/* Dialogue Transcript Scroll Area */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[340px] pr-2">
            <div className="text-center my-1">
              <span className="text-[11px] font-mono uppercase bg-white/5 px-3 py-1 rounded-full text-neutral-400 border border-white/5">
                INTERROGATION RECORD • ERA {currentEra} • {suspect.nameByEra[currentEra].toUpperCase()}
              </span>
            </div>

            {dialogueHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-500 text-center">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                <p className="text-xs">
                  Begin interrogation by selecting an inquiry prompt or confronting with cross-era evidence below.
                </p>
              </div>
            ) : (
              dialogueHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    item.sender === 'detective'
                      ? 'ml-auto bg-cyan-950/60 border border-cyan-500/30 text-cyan-100 rounded-br-none'
                      : 'mr-auto bg-neutral-900/90 border border-white/10 text-neutral-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-60 mb-1">
                    <span>{item.sender === 'detective' ? 'DETECTIVE' : suspect.nameByEra[item.era]}</span>
                    <span>ERA {item.era}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Action Prompts & Evidence Confrontation Bar */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-3">
            {/* Inquiry Prompts */}
            <div className="flex flex-wrap gap-2">
              {suspect.dialogueNodes
                .filter(d => d.era === currentEra)
                .map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleAskQuestion(d.prompt, d.response, d.unlocksClueId)}
                    className="text-left text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-200 p-2.5 rounded-xl border border-white/10 hover:border-cyan-500/40 transition-all flex items-center gap-2"
                  >
                    <HelpCircle size={14} className="text-cyan-400 shrink-0" />
                    <span>{d.prompt}</span>
                  </button>
                ))}
            </div>

            {/* Confront Evidence Selector */}
            <div className="bg-black/40 p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <ShieldAlert size={16} className="text-red-400" />
                <span className="text-xs font-bold text-neutral-200">
                  Confront with Cross-Timeline Evidence:
                </span>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto flex-1 justify-end">
                <select
                  value={confrontationTargetClueId || ''}
                  onChange={e => setConfrontationTargetClueId(e.target.value || null)}
                  className="bg-neutral-900 border border-white/15 text-neutral-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-400 flex-1 md:flex-initial"
                >
                  <option value="">Select Evidence from Dossier...</option>
                  {unlockedClueIds.map(clueId => {
                    const clue = CLUES[clueId];
                    if (!clue) return null;
                    return (
                      <option key={clueId} value={clueId}>
                        [{clue.era}] {clue.title}
                      </option>
                    );
                  })}
                </select>

                <button
                  onClick={handleConfrontEvidence}
                  disabled={!confrontationTargetClueId}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    confrontationTargetClueId
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:opacity-90 shadow-red-500/25'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={14} />
                  <span>Break Alibi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
