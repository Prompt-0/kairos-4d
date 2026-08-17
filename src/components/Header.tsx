import React from 'react';
import { EraId } from '../engine/types';
import { ERAS } from '../engine/storyData';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Search, 
  Pin, 
  MessageSquare, 
  Microscope, 
  ShieldAlert, 
  BookOpen 
} from 'lucide-react';

interface HeaderProps {
  currentEra: EraId;
  timelineStability: number;
  activeTab: string;
  onTabChange: (tab: any) => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onResetGame: () => void;
  solvedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentEra,
  timelineStability,
  activeTab,
  onTabChange,
  soundMuted,
  onToggleSound,
  onResetGame,
  solvedCount,
}) => {
  const era = ERAS[currentEra];

  const getEraBadgeClasses = () => {
    switch (currentEra) {
      case '1926':
        return 'border-[#d4af37] bg-[#201710]/90 text-[#e6a15c] glow-gold font-cinzel';
      case '2026':
        return 'border-[#06b6d4] bg-[#102133]/90 text-[#06b6d4] glow-cyan font-sans';
      case '2156':
        return 'border-[#a855f7] bg-[#1c0f33]/90 text-[#00f0ff] glow-neon font-orbitron';
    }
  };

  const navItems = [
    { id: 'investigate', label: 'Investigate', icon: Search },
    { id: 'evidence_board', label: '4D Pinboard', icon: Pin, badge: solvedCount > 0 ? `${solvedCount}/4` : undefined },
    { id: 'interrogate', label: 'Interrogate', icon: MessageSquare },
    { id: 'forensics', label: 'Quantum Lab', icon: Microscope },
    { id: 'vault', label: 'Paradox Vault', icon: ShieldAlert, highlight: timelineStability === 100 },
    { id: 'guide', label: 'Manual', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel px-4 py-2.5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-amber-500/20 border border-white/20 shadow-lg">
            <span className="text-xl font-black bg-gradient-to-r from-amber-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              K4
            </span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-wider font-orbitron bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                KAIROS 4D
              </h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getEraBadgeClasses()} tracking-wide transition-all duration-300`}>
                {era.name.split('—')[0].trim()}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Temporal Paradox Murder Mystery Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                } ${item.highlight ? 'animate-pulse text-purple-300 border border-purple-500/50' : ''}`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-cyan-500/30 text-cyan-300 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Stability Gauge & Controls */}
        <div className="flex items-center gap-3">
          {/* Timeline Stability Meter */}
          <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Timeline Stability
              </div>
              <div className="text-xs font-mono font-bold text-cyan-300">
                {timelineStability}%
              </div>
            </div>
            <div className="w-16 h-2 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-purple-500 transition-all duration-500"
                style={{ width: `${timelineStability}%` }}
              />
            </div>
            {timelineStability === 100 && (
              <Sparkles size={14} className="text-purple-400 animate-spin" />
            )}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            title={soundMuted ? 'Unmute Web Audio' : 'Mute Web Audio'}
            className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Reset Game */}
          <button
            onClick={() => {
              if (confirm('Reset investigation progress and restart from Era 1926?')) {
                onResetGame();
              }
            }}
            title="Reset Investigation"
            className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
