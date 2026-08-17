import React from 'react';
import { Clue } from '../engine/types';
import { X, Microscope, FileText } from 'lucide-react';

interface ClueInspectModalProps {
  clue: Clue | null;
  onClose: () => void;
  onOpenInSpectrometer: (clueId: string) => void;
}

export const ClueInspectModal: React.FC<ClueInspectModalProps> = ({
  clue,
  onClose,
  onOpenInSpectrometer,
}) => {
  if (!clue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-warp">
      <div className="relative w-full max-w-xl glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                ERA {clue.era} • {clue.category.toUpperCase()}
              </span>
            </div>
            <h3 className="text-base font-bold text-neutral-100 mt-1">{clue.title}</h3>
          </div>
        </div>

        {/* Description & Detailed Forensics */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3.5 rounded-2xl border border-white/5">
            {clue.description}
          </p>

          <div className="bg-neutral-900/80 p-3.5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
              Forensic Analysis & Archival Notes:
            </span>
            <p className="text-xs text-neutral-200 leading-relaxed font-serif">
              "{clue.details}"
            </p>
          </div>

          {/* Spectrometry Preview */}
          {clue.spectrometryData && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 block">CHRONAL DISPLACEMENT</span>
                <span className="font-mono font-bold text-amber-300">
                  +{clue.spectrometryData.tachyonAgeYears} Years
                </span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 block">QUANTUM ENTANGLEMENT</span>
                <span className="font-mono font-bold text-cyan-300">
                  {clue.spectrometryData.entanglementLevel}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onOpenInSpectrometer(clue.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg transition-all"
          >
            <Microscope size={16} />
            <span>Examine in Quantum Spectrometer</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-neutral-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
