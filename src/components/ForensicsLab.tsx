import React, { useState } from 'react';
import { EraId, Clue } from '../engine/types';
import { CLUES } from '../engine/storyData';
import { 
  Microscope, 
  Scan, 
  Binary, 
  Compass, 
  CheckCircle2, 
  Radio, 
  Cpu 
} from 'lucide-react';

interface ForensicsLabProps {
  currentEra?: EraId;
  unlockedClueIds: string[];
  selectedClueId: string | null;
  onSelectClue: (clueId: string) => void;
  onExecuteCausalityAction: (actionId: string) => void;
  completedActionIds: string[];
  showToast: (msg: string, type?: any) => void;
}

export const ForensicsLab: React.FC<ForensicsLabProps> = ({
  unlockedClueIds,
  selectedClueId,
  onSelectClue,
  onExecuteCausalityAction,
  completedActionIds,
  showToast,
}) => {
  const [activeBand, setActiveBand] = useState<'optical' | 'infrared' | 'tachyon'>('optical');
  const [labTool, setLabTool] = useState<'spectrometer' | 'ciphers'>('spectrometer');

  // Cipher 1926 Dials
  const [marsDeg, setMarsDeg] = useState<number>(0);
  const [jupiterDeg, setJupiterDeg] = useState<number>(0);
  const [venusDeg, setVenusDeg] = useState<number>(0);

  // Cipher 2026 Frequency slider
  const [freqHz, setFreqHz] = useState<number>(440);

  // Cipher 2156 Qubits
  const [qubits, setQubits] = useState<[boolean, boolean, boolean, boolean]>([false, false, false, false]);

  const activeClue: Clue | undefined = selectedClueId ? CLUES[selectedClueId] : undefined;

  const isVaultSolved = completedActionIds.includes('action_solve_vault_cipher_1926');

  const check1926Vault = () => {
    // Target: Mars 82, Jupiter 247, Venus 315 (allow +/- 10 degrees)
    const marsOk = Math.abs(marsDeg - 82) <= 12;
    const jupiterOk = Math.abs(jupiterDeg - 247) <= 12;
    const venusOk = Math.abs(venusDeg - 315) <= 12;

    if (marsOk && jupiterOk && venusOk) {
      onExecuteCausalityAction('action_solve_vault_cipher_1926');
      showToast('🌟 Astronomical Vault Unlocked! Planetary Conjunction Aligned!', 'eureka');
    } else {
      showToast('Astronomical dials misaligned. Consult the 1926 celestial cipher notes.', 'warning');
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-col gap-4">
      {/* Sub-tool selector */}
      <div className="flex items-center gap-3 glass-panel p-2.5 rounded-2xl border border-white/10">
        <button
          onClick={() => setLabTool('spectrometer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            labTool === 'spectrometer'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Microscope size={16} />
          <span>Multi-Band Tachyon Spectrometer</span>
        </button>

        <button
          onClick={() => setLabTool('ciphers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            labTool === 'ciphers'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Binary size={16} />
          <span>Multi-Era Cryptography & Ciphers</span>
        </button>
      </div>

      {labTool === 'spectrometer' ? (
        /* --- TACHYON SPECTROMETER INTERFACE --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Clue Selector Drawer */}
          <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col gap-3">
            <h3 className="font-bold text-xs text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Scan size={14} className="text-cyan-400" />
              <span>Evidence Specimen Chamber</span>
            </h3>

            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {unlockedClueIds.map(clueId => {
                const clue = CLUES[clueId];
                if (!clue) return null;
                const isSelected = selectedClueId === clueId;

                return (
                  <button
                    key={clueId}
                    onClick={() => onSelectClue(clueId)}
                    className={`text-left p-3 rounded-2xl border transition-all text-xs flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-100 shadow-md ring-2 ring-cyan-500/30'
                        : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-200">{clue.title}</span>
                      <span className="text-[9px] font-mono uppercase bg-black/40 px-1.5 py-0.5 rounded">
                        Era {clue.era}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">{clue.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Spectrometer Readout */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between gap-4">
            {activeClue ? (
              <div className="flex flex-col gap-4">
                {/* Header & Waveband Selectors */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100">{activeClue.title}</h3>
                    <p className="text-xs text-neutral-400">Category: {activeClue.category.toUpperCase()}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setActiveBand('optical')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeBand === 'optical'
                          ? 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Optical Band
                    </button>
                    <button
                      onClick={() => setActiveBand('infrared')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeBand === 'infrared'
                          ? 'bg-red-950 text-red-300 border border-red-500/30'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Infrared / UV
                    </button>
                    <button
                      onClick={() => setActiveBand('tachyon')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeBand === 'tachyon'
                          ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Tachyon Wave
                    </button>
                  </div>
                </div>

                {/* Spectral Canvas & Waveform Analysis */}
                <div className="relative w-full h-44 rounded-2xl bg-black/80 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4">
                  {/* Laser Scan line effect */}
                  <div className="absolute inset-0 scanline-overlay opacity-50" />
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-400 blur-sm animate-[pulse_2s_infinite]" />

                  {activeBand === 'optical' && (
                    <div className="text-center z-10">
                      <div className="text-xs font-mono text-cyan-300 mb-1">VISIBLE SPECTRUM SCAN (380 - 750 nm)</div>
                      <p className="text-xs text-neutral-200 max-w-md">
                        {activeClue.spectrometryData?.optical || activeClue.details}
                      </p>
                    </div>
                  )}

                  {activeBand === 'infrared' && (
                    <div className="text-center z-10 text-red-300">
                      <div className="text-xs font-mono text-red-400 mb-1">THERMAL / UV MOLECULAR RESONANCE</div>
                      <p className="text-xs text-red-200 max-w-md">
                        {activeClue.spectrometryData?.infrared || 'Thermal equilibrium standard.'}
                      </p>
                    </div>
                  )}

                  {activeBand === 'tachyon' && (
                    <div className="text-center z-10 text-purple-300">
                      <div className="text-xs font-mono text-purple-400 mb-1">CHRONAL DISPLACEMENT & ENTANGLEMENT</div>
                      <p className="text-xs text-purple-200 max-w-md">
                        {activeClue.spectrometryData?.tachyon || 'Baseline chronological signature.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <div className="text-[10px] uppercase font-mono text-neutral-400">Chronal Age Offset</div>
                    <div className="text-sm font-mono font-bold text-amber-300">
                      +{activeClue.spectrometryData?.tachyonAgeYears || 0} Years
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <div className="text-[10px] uppercase font-mono text-neutral-400">Quantum Entanglement</div>
                    <div className="text-sm font-mono font-bold text-cyan-300">
                      {activeClue.spectrometryData?.entanglementLevel || 0}%
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5 col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase font-mono text-neutral-400">Causal Coherence</div>
                    <div className="text-sm font-mono font-bold text-purple-300">STABLE</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                <Microscope size={40} className="mb-2 opacity-50" />
                <p className="text-xs">Select a specimen from the chamber on the left to begin multi-band spectrometry.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* --- CIPHER DECRYPTION TERMINAL --- */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1926 Astronomical Dial Vault */}
          <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-400 border-b border-amber-500/20 pb-2">
                <Compass size={18} />
                <h4 className="font-bold text-xs uppercase font-cinzel">1926: Planetary Vault Dials</h4>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Rotate the 3 planetary astronomical tumblers to match the equinox celestial conjunction.
              </p>

              {/* Dials */}
              <div className="flex flex-col gap-2.5">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Mars Tumbler (Target: ~082°)</span>
                    <span className="font-mono text-amber-300 font-bold">{marsDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={marsDeg}
                    onChange={e => setMarsDeg(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Jupiter Tumbler (Target: ~247°)</span>
                    <span className="font-mono text-amber-300 font-bold">{jupiterDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={jupiterDeg}
                    onChange={e => setJupiterDeg(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Venus Tumbler (Target: ~315°)</span>
                    <span className="font-mono text-amber-300 font-bold">{venusDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={venusDeg}
                    onChange={e => setVenusDeg(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {isVaultSolved ? (
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-green-950/40 border border-green-500/40 text-green-300 text-xs font-bold">
                <CheckCircle2 size={16} />
                <span>Vault Unlocked (Causality Propagated)</span>
              </div>
            ) : (
              <button
                onClick={check1926Vault}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-bold text-xs shadow-lg hover:opacity-90 transition-all"
              >
                Test Planetary Alignment
              </button>
            )}
          </div>

          {/* 2026 Acoustic Waveform Frequency Matcher */}
          <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-400 border-b border-cyan-500/20 pb-2">
                <Radio size={18} />
                <h4 className="font-bold text-xs uppercase">2026: Resonance Harmonizer</h4>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Tune the acoustic carrier oscillator to isolate Dr. Vance's 1.042 Hz chronal clock pulse.
              </p>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Frequency Modulator</span>
                  <span className="font-mono text-cyan-300 font-bold">{freqHz} Hz</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={freqHz}
                  onChange={e => setFreqHz(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-[11px] text-neutral-400 font-mono">
                Harmonic Ratio: {(freqHz / 1.042).toFixed(2)}x <br />
                Status: {Math.abs(freqHz - 104) <= 5 ? 'HARMONIC LOCK ACHIEVED' : 'SEEKING CARRIER'}
              </div>
            </div>

            <div className="p-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-[11px] text-cyan-200">
              Matches the acoustic findings in Clue #911 Audio Waveform.
            </div>
          </div>

          {/* 2156 Qubit Entanglement Matrix */}
          <div className="glass-panel p-5 rounded-3xl border border-purple-500/30 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-purple-400 border-b border-purple-500/20 pb-2">
                <Cpu size={18} />
                <h4 className="font-bold text-xs uppercase font-orbitron">2156: Qubit Superposition</h4>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Flip quantum gates to construct the Bell state manifold $|1111\rangle$.
              </p>

              <div className="grid grid-cols-4 gap-2">
                {qubits.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const next: [boolean, boolean, boolean, boolean] = [...qubits];
                      next[idx] = !next[idx];
                      setQubits(next);
                      if (next.every(Boolean)) {
                        showToast('⚡ Quantum Entanglement State |1111⟩ Synchronized!', 'eureka');
                      }
                    }}
                    className={`py-4 rounded-xl font-mono text-sm font-bold border transition-all ${
                      q
                        ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/30 scale-105'
                        : 'bg-black/60 text-neutral-500 border-white/10'
                    }`}
                  >
                    |{q ? '1' : '0'}⟩
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-xl text-[11px] text-purple-200 font-mono">
              Entanglement State: {qubits.every(Boolean) ? 'BELL RESONANCE COMPLETE' : 'DECOHERENT'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
