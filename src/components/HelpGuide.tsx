import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Pin, 
  Sparkles, 
  Microscope, 
  MessageSquare, 
  Zap 
} from 'lucide-react';

export const HelpGuide: React.FC = () => {
  const guideSections = [
    {
      icon: Clock,
      title: '1. The 3 Interconnected Eras (1926 • 2026 • 2156)',
      content:
        'Dr. Vance was murdered across time. Use the top timeline switcher to jump between the 1926 Gilded Age, 2026 Modern Forensics, and 2156 Cyber Singularity. Each era features distinct clues, environments, and suspect echoes.',
    },
    {
      icon: Zap,
      title: '2. 4D Causality Alterations (Past -> Future)',
      content:
        'Actions performed in 1926 (such as calibrating clock escapements, feeding the lunar orchid, or unlocking planetary vault dials) immediately ripple forward to transform items, decrypt safes, and stabilize tachyon storms in 2026 and 2156!',
    },
    {
      icon: Pin,
      title: '3. 4D Corkboard & Red-Yarn Clue Synthesis',
      content:
        'On the 4D Pinboard, drag and drop discovered evidence cards. Select 2 or more related cross-era clues and click "Synthesize 4D Hypothesis". Solving all 4 milestones unlocks the Grand Paradox Vault.',
    },
    {
      icon: MessageSquare,
      title: '4. Suspect Interrogation & Cross-Timeline Contradictions',
      content:
        'Interrogate suspects and confront their alibis with contradictory physical evidence gathered from other centuries. Breaking an alibi forces a dramatic confession.',
    },
    {
      icon: Microscope,
      title: '5. Quantum Spectrometry & Multi-Era Ciphers',
      content:
        'Analyze evidence across Optical, Infrared/UV, and Tachyon Wavebands in the Quantum Lab. Solve the 1926 Astronomical dials, 2026 Frequency Harmonizer, and 2156 Qubit Matrix.',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-col gap-4">
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-100">
              Chief Detective's Chrono-Investigation Field Manual
            </h2>
            <p className="text-xs text-neutral-400">
              Protocols for navigating closed timelike curves, causality propagation, and multi-era paradoxes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guideSections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <Icon size={16} />
                  <span>{sec.title}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{sec.content}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-amber-950/40 border border-white/10 text-xs text-neutral-200 flex items-center gap-3">
          <Sparkles size={20} className="text-amber-400 shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Start by examining the Grandfather Clock in 1926, calibrate its gear escapement, then time-shift to 2026 to see what compartment opened!
          </span>
        </div>
      </div>
    </section>
  );
};
