import React from 'react';
import { EraId } from '../engine/types';
import { ERAS } from '../engine/storyData';
import { Clock, Shield, Sparkles, Zap } from 'lucide-react';

interface EraSwitcherProps {
  currentEra: EraId;
  onSwitchEra: (era: EraId) => void;
  completedActionCount: number;
}

export const EraSwitcher: React.FC<EraSwitcherProps> = ({
  currentEra,
  onSwitchEra,
  completedActionCount,
}) => {
  const activeEraInfo = ERAS[currentEra];

  const eraOrder: EraId[] = ['1926', '2026', '2156'];

  const getEraThemeColors = (eraId: EraId) => {
    switch (eraId) {
      case '1926':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-[#201710]/95',
          activeBg: 'bg-gradient-to-r from-amber-600/30 to-yellow-600/20 text-amber-200 border-amber-500/80',
          text: 'text-amber-400',
        };
      case '2026':
        return {
          border: 'border-cyan-500/40',
          bg: 'bg-[#102133]/95',
          activeBg: 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-200 border-cyan-500/80',
          text: 'text-cyan-400',
        };
      case '2156':
        return {
          border: 'border-purple-500/40',
          bg: 'bg-[#1c0f33]/95',
          activeBg: 'bg-gradient-to-r from-purple-600/30 to-pink-600/20 text-purple-200 border-purple-500/80',
          text: 'text-purple-400',
        };
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-3">
      {/* Era Navigation Strip */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Era Selector Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          {eraOrder.map(eraId => {
            const era = ERAS[eraId];
            const isSelected = currentEra === eraId;
            const theme = getEraThemeColors(eraId);

            return (
              <button
                key={eraId}
                onClick={() => onSwitchEra(eraId)}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                  isSelected
                    ? `${theme.activeBg} shadow-lg scale-[1.02]`
                    : 'border-white/5 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80'
                }`}
              >
                <Clock size={16} className={isSelected ? theme.text : 'text-neutral-500'} />
                <div className="text-left">
                  <div className="font-mono text-xs uppercase tracking-wider opacity-70">
                    Era {era.year}
                  </div>
                  <div className="text-xs font-bold leading-none mt-0.5">
                    {eraId === '1926' ? 'Gilded Age' : eraId === '2026' ? 'Forensics' : 'Singularity'}
                  </div>
                </div>

                {isSelected && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Timeline Status & Causality Telemetry */}
        <div className="flex items-center gap-4 text-xs w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-neutral-300">
            <Zap size={14} className="text-amber-400" />
            <span className="text-neutral-400">Causality Ripples:</span>
            <span className="font-mono font-bold text-amber-300">{completedActionCount} Active</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-neutral-300">
            <Shield size={14} className="text-cyan-400" />
            <span className="text-neutral-400">Tech Matrix:</span>
            <span className="font-mono text-[11px] font-semibold text-cyan-300">
              {activeEraInfo.techLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Active Era Narrative Banner */}
      <div
        className={`mt-2 p-3 rounded-xl border text-xs transition-all duration-500 flex items-center justify-between gap-3 ${
          currentEra === '1926'
            ? 'glass-panel-amber text-amber-200/90'
            : currentEra === '2026'
            ? 'glass-panel-cyan text-cyan-200/90'
            : 'glass-panel-neon text-purple-200/90'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={16} className="shrink-0" />
          <div>
            <span className="font-bold tracking-wide uppercase mr-2 opacity-90">
              {activeEraInfo.name}
            </span>
            <span className="opacity-75">{activeEraInfo.subtitle}</span>
          </div>
        </div>
        <div className="hidden lg:block text-[11px] opacity-60 italic max-w-md text-right">
          {activeEraInfo.description}
        </div>
      </div>
    </section>
  );
};
