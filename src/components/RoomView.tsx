import React, { useState } from 'react';
import { EraId, RoomId, Hotspot, Clue } from '../engine/types';
import { ROOMS, HOTSPOTS, CLUES } from '../engine/storyData';
import { CAUSALITY_ACTIONS } from '../engine/causalityRules';
import { 
  Clock, 
  FlaskConical, 
  ShieldAlert, 
  Flower2, 
  Sparkles, 
  Zap, 
  Info, 
  Search, 
  Eye, 
  CheckCircle2 
} from 'lucide-react';

interface RoomViewProps {
  currentEra: EraId;
  currentRoomId: RoomId;
  onSwitchRoom: (roomId: RoomId) => void;
  unlockedClueIds: string[];
  completedActionIds: string[];
  onUnlockClue: (clueId: string) => void;
  onExecuteCausalityAction: (actionId: string) => void;
  onInspectClue: (clue: Clue) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  currentEra,
  currentRoomId,
  onSwitchRoom,
  unlockedClueIds,
  completedActionIds,
  onUnlockClue,
  onExecuteCausalityAction,
  onInspectClue,
}) => {
  const room = ROOMS[currentRoomId];
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  // Filter hotspots for current room
  const roomHotspots = HOTSPOTS.filter(h => h.roomId === currentRoomId);

  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return Clock;
      case 'FlaskConical': return FlaskConical;
      case 'ShieldAlert': return ShieldAlert;
      case 'Flower2': return Flower2;
      default: return Sparkles;
    }
  };

  const getEraBackdropStyle = () => {
    switch (currentEra) {
      case '1926':
        return 'from-[#2c1d11] via-[#1a120b] to-[#0d0a07] border-amber-500/20';
      case '2026':
        return 'from-[#0b253a] via-[#091522] to-[#040910] border-cyan-500/20';
      case '2156':
        return 'from-[#220d3d] via-[#120622] to-[#06020c] border-purple-500/20';
    }
  };

  // Check if any causality action is attached to a hotspot in this era
  const getCausalityActionForHotspot = (hotspot: Hotspot) => {
    if (hotspot.id === 'hs_atrium_clock' && currentEra === '1926') {
      return CAUSALITY_ACTIONS.action_calibrate_escapement_1926;
    }
    if (hotspot.id === 'hs_cons_orchid' && currentEra === '1926') {
      return CAUSALITY_ACTIONS.action_nourish_orchid_1926;
    }
    if (hotspot.id === 'hs_study_vault' && currentEra === '1926') {
      return CAUSALITY_ACTIONS.action_solve_vault_cipher_1926;
    }
    if (hotspot.id === 'hs_cons_bench' && currentEra === '1926') {
      return CAUSALITY_ACTIONS.action_inscribe_bench_1926;
    }
    return null;
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-col gap-4">
      {/* Room Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Object.values(ROOMS).map(r => {
          const Icon = getRoomIcon(r.iconName);
          const isSelected = currentRoomId === r.id;

          return (
            <button
              key={r.id}
              onClick={() => {
                onSwitchRoom(r.id as RoomId);
                setSelectedHotspot(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                isSelected
                  ? 'bg-neutral-800 text-white border-white/30 shadow-md scale-[1.01]'
                  : 'bg-neutral-950/60 text-neutral-400 border-white/5 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Icon size={16} className={isSelected ? 'text-cyan-400' : 'text-neutral-500'} />
              <span>{r.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main 2.5D Room Investigation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left/Center: Visual Scene Canvas */}
        <div
          className={`lg:col-span-2 relative min-h-[460px] rounded-3xl border p-6 overflow-hidden bg-gradient-to-b ${getEraBackdropStyle()} shadow-2xl flex flex-col justify-between`}
        >
          {/* Ambient Lighting & Atmosphere Overlays */}
          <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40" />
          <div className="absolute inset-0 vignette-overlay pointer-events-none" />

          {/* Era Particle / Effect Overlay */}
          {currentEra === '1926' && (
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
          )}
          {currentEra === '2026' && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
          )}
          {currentEra === '2156' && (
            <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          )}

          {/* Scene Header Info */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="text-neutral-400 mr-2">LOCATION:</span>
              <span className="font-bold text-neutral-100">{room.name}</span>
              <span className="text-neutral-500 mx-2">•</span>
              <span className="font-mono text-cyan-300">ERA {currentEra}</span>
            </div>

            <div className="text-[11px] font-mono text-neutral-400 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
              {roomHotspots.length} INSPECTION NODES DETECTED
            </div>
          </div>

          {/* Interactive Hotspot Markers */}
          <div className="relative z-20 w-full h-[320px] my-auto">
            {roomHotspots.map(hotspot => {
              const clueId = hotspot.unlockedClueIdByEra?.[currentEra];
              const isClueUnlocked = clueId ? unlockedClueIds.includes(clueId) : false;
              const isSelected = selectedHotspot?.id === hotspot.id;
              const causalityAction = getCausalityActionForHotspot(hotspot);
              const isActionCompleted = causalityAction
                ? completedActionIds.includes(causalityAction.id)
                : false;

              return (
                <div
                  key={hotspot.id}
                  style={{
                    position: 'absolute',
                    left: `${hotspot.xPercent}%`,
                    top: `${hotspot.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="group"
                >
                  <button
                    onClick={() => {
                      setSelectedHotspot(hotspot);
                      if (clueId) {
                        onUnlockClue(clueId);
                      }
                    }}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-xl ${
                      isSelected
                        ? 'bg-cyan-500 text-black scale-110 ring-4 ring-cyan-400/40'
                        : isClueUnlocked
                        ? 'bg-neutral-900/90 text-cyan-400 border border-cyan-500/40 hover:scale-105 hover:bg-neutral-800'
                        : 'bg-neutral-950/90 text-amber-400 border border-amber-500/40 hover:scale-105 hover:bg-neutral-900'
                    }`}
                  >
                    <Search size={20} />

                    {/* Notification Dot */}
                    {!isClueUnlocked && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    )}

                    {causalityAction && !isActionCompleted && (
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 rounded-full bg-purple-500 items-center justify-center text-[9px] text-white">
                        ⚡
                      </span>
                    )}
                  </button>

                  {/* Tooltip Label */}
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-black/90 text-neutral-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 shadow-lg z-30">
                    {hotspot.nameByEra[currentEra]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scene Footer Description */}
          <div className="relative z-10 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs text-neutral-300 flex items-center gap-2">
            <Info size={16} className="shrink-0 text-cyan-400" />
            <span>{room.descriptionByEra[currentEra]}</span>
          </div>
        </div>

        {/* Right Column: Hotspot Inspector & Causality Triggers */}
        <div className="flex flex-col gap-3">
          {selectedHotspot ? (
            <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col justify-between h-full animate-warp">
              <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-cyan-400" />
                    <h3 className="font-bold text-sm text-neutral-100">
                      {selectedHotspot.nameByEra[currentEra]}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-neutral-400">
                    Inspecting
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                  {selectedHotspot.descriptionByEra[currentEra]}
                </p>

                {/* Unlocked Clue Badge & Shortcut */}
                {selectedHotspot.unlockedClueIdByEra?.[currentEra] && (
                  <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                        <CheckCircle2 size={14} className="text-cyan-400" />
                        <span>Evidence Logged in Dossier</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">
                        ERA {currentEra}
                      </span>
                    </div>

                    {(() => {
                      const cid = selectedHotspot.unlockedClueIdByEra?.[currentEra];
                      if (!cid || !CLUES[cid]) return null;
                      const clue = CLUES[cid];
                      return (
                        <button
                          onClick={() => onInspectClue(clue)}
                          className="text-left text-xs text-neutral-200 font-semibold hover:text-cyan-300 underline underline-offset-2"
                        >
                          📄 {clue.title}
                        </button>
                      );
                    })()}
                  </div>
                )}

                {/* Causality Modification Trigger (If Available) */}
                {(() => {
                  const action = getCausalityActionForHotspot(selectedHotspot);
                  if (!action) return null;
                  const isCompleted = completedActionIds.includes(action.id);

                  return (
                    <div className="mt-2 bg-purple-950/40 border border-purple-500/40 p-3 rounded-xl flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                        <Zap size={14} className="text-purple-400" />
                        <span>4D Causality Alteration</span>
                      </div>

                      <p className="text-[11px] text-purple-200/80 leading-snug">
                        {action.description}
                      </p>

                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-950/40 p-2 rounded-lg border border-green-500/30">
                          <CheckCircle2 size={14} />
                          <span>Timeline Ripple Active (Altered 2026 & 2156)</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onExecuteCausalityAction(action.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                        >
                          <Zap size={14} />
                          <span>Execute Temporal Ripple</span>
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Close / Deselect */}
              <button
                onClick={() => setSelectedHotspot(null)}
                className="mt-4 w-full py-1.5 rounded-xl border border-white/10 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-400 hover:text-neutral-200 transition-all"
              >
                Close Inspection
              </button>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center h-full text-neutral-500">
              <Search size={32} className="mb-2 text-neutral-600 animate-pulse" />
              <h4 className="font-bold text-xs text-neutral-400">No Target Selected</h4>
              <p className="text-[11px] max-w-xs mt-1 text-neutral-500">
                Click any interactive inspection node in the scene to examine details, discover clues, or execute past causality alterations.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
