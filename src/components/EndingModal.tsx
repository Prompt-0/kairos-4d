import React from 'react';
import confetti from 'canvas-confetti';
import { ENDINGS } from '../engine/storyData';
import { Crown, Sparkles, RotateCcw } from 'lucide-react';

interface EndingModalProps {
  endingId: string | null;
  onRestart: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({ endingId, onRestart }) => {
  if (!endingId) return null;
  const ending = ENDINGS[endingId] || ENDINGS.master_detective;

  React.useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#00f0ff', '#d4af37', '#a855f7', '#ff0055', '#ffffff'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-warp">
      <div className="relative w-full max-w-2xl glass-panel p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center text-center gap-6">
        {/* Victory Icon Crown */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-cyan-500/20 to-purple-500/20 border border-white/30 shadow-2xl">
          <Crown size={36} className="text-amber-400 animate-bounce" />
          <Sparkles size={20} className="absolute -top-2 -right-2 text-cyan-300 animate-spin" />
        </div>

        {/* Ending Titles */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
            TIMELINE CONVERGENCE CONCLUDED
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-orbitron">
            {ending.title}
          </h2>
          <p className="text-xs sm:text-sm text-purple-300 font-semibold">{ending.subtitle}</p>
        </div>

        {/* Narrative Epilogue */}
        <div className="bg-black/50 p-6 rounded-3xl border border-white/10 text-xs sm:text-sm text-neutral-200 leading-relaxed text-left">
          <p>{ending.description}</p>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-amber-300/90 font-serif italic text-center">
            {ending.quote}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-2">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-purple-600 to-amber-600 text-white font-bold text-xs sm:text-sm shadow-xl hover:opacity-90 transition-all scale-105"
          >
            <RotateCcw size={18} />
            <span>Embark on Another Investigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
