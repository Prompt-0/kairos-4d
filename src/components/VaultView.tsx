import React from 'react';
import { ENDINGS, DEDUCTION_HYPOTHESES } from '../engine/storyData';
import { 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Crown, 
  GitFork, 
  Flame, 
  Cpu 
} from 'lucide-react';

interface VaultViewProps {
  solvedDeductionIds: string[];
  timelineStability: number;
  onTriggerEnding: (endingId: string) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  solvedDeductionIds,
  timelineStability,
  onTriggerEnding,
}) => {
  const isAllSolved = solvedDeductionIds.length === DEDUCTION_HYPOTHESES.length;

  const endingCards = [
    {
      ending: ENDINGS.master_detective,
      icon: Crown,
      btnColor: 'from-cyan-500 to-blue-600',
      tag: 'RECOMMENDED CANON',
    },
    {
      ending: ENDINGS.alchemical_ascendance,
      icon: Flame,
      btnColor: 'from-amber-500 to-yellow-600',
      tag: '1926 RENAISSANCE',
    },
    {
      ending: ENDINGS.singularity,
      icon: Cpu,
      btnColor: 'from-purple-500 to-pink-600',
      tag: '2156 TRANSHUMAN',
    },
    {
      ending: ENDINGS.entropy_fracture,
      icon: GitFork,
      btnColor: 'from-red-500 to-orange-600',
      tag: 'CHAOS DIVERGENCE',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-col gap-5">
      {/* Vault Status Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <span>The Grandfather Paradox Stabilization Vault</span>
              {isAllSolved && <Sparkles size={18} className="text-amber-400 animate-spin" />}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Synthesize all four causal deduction milestones to stabilize spacetime and select humanity's timeline destiny.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono text-neutral-400">DEDUCTIONS SOLVED</div>
            <div className="text-base font-bold font-mono text-cyan-300">
              {solvedDeductionIds.length} / 4
            </div>
          </div>
          <div className="text-right pl-3 border-l border-white/10">
            <div className="text-xs font-mono text-neutral-400">STABILITY</div>
            <div className="text-base font-bold font-mono text-purple-300">
              {timelineStability}%
            </div>
          </div>
        </div>
      </div>

      {/* Requirement Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEDUCTION_HYPOTHESES.map(hypo => {
          const isSolved = solvedDeductionIds.includes(hypo.id);
          return (
            <div
              key={hypo.id}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isSolved
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-neutral-200'
                  : 'bg-neutral-950/40 border-white/5 text-neutral-500'
              }`}
            >
              {isSolved ? (
                <CheckCircle2 size={20} className="text-cyan-400 shrink-0" />
              ) : (
                <Lock size={18} className="text-neutral-600 shrink-0" />
              )}
              <div>
                <div className="text-[10px] font-mono uppercase opacity-75">
                  Chapter {hypo.chapter} Milestone
                </div>
                <div className="text-xs font-bold leading-tight mt-0.5">{hypo.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Branching Timeline Outcomes */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
          Timeline Stabilization Vectors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endingCards.map(({ ending, icon: Icon, btnColor, tag }) => (
            <div
              key={ending.id}
              className={`glass-panel p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                isAllSolved
                  ? 'border-white/20 hover:border-cyan-400/50 hover:scale-[1.01]'
                  : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={18} className="text-cyan-300" />
                    <span className="text-xs font-bold font-mono text-cyan-300">{tag}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 uppercase">
                    {ending.alignment.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-neutral-100">{ending.title}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{ending.description}</p>
                <div className="text-[11px] text-neutral-400 italic font-serif">
                  {ending.quote}
                </div>
              </div>

              {isAllSolved ? (
                <button
                  onClick={() => onTriggerEnding(ending.id)}
                  className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${btnColor} text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                >
                  <Sparkles size={14} />
                  <span>Stabilize Timeline — Trigger Ending</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 rounded-xl bg-neutral-900 text-neutral-500 text-xs font-semibold border border-white/5">
                  <Lock size={12} />
                  <span>Locked • Solve All 4 Deductions</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
