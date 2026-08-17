import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Clue, PinboardNode, PinboardLink } from '../engine/types';
import { CLUES, DEDUCTION_HYPOTHESES } from '../engine/storyData';
import { 
  Pin, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  Lightbulb, 
  Info, 
  Lock
} from 'lucide-react';

interface EvidenceBoardProps {
  unlockedClueIds: string[];
  pinboardNodes: PinboardNode[];
  pinboardLinks: PinboardLink[];
  selectedNodeIds: string[];
  solvedDeductionIds: string[];
  onToggleSelectNode: (nodeId: string) => void;
  onLinkNodes?: (fromId: string, toId: string) => void;
  onSynthesizeHypothesis: () => any;
  onUpdateNodePos: (nodeId: string, x: number, y: number) => void;
  onInspectClue: (clue: Clue) => void;
}

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  unlockedClueIds,
  pinboardNodes,
  pinboardLinks,
  selectedNodeIds,
  solvedDeductionIds,
  onToggleSelectNode,
  onSynthesizeHypothesis,
  onUpdateNodePos,
  onInspectClue,
}) => {
  const [filterEra, setFilterEra] = useState<string>('all');
  const [activeDragNodeId, setActiveDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, node: PinboardNode) => {
    e.stopPropagation();
    setActiveDragNodeId(node.id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeDragNodeId || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 200, e.clientX - dragOffset.x));
    const newY = Math.max(20, Math.min(rect.height - 120, e.clientY - dragOffset.y));
    onUpdateNodePos(activeDragNodeId, newX, newY);
  };

  const handleMouseUp = () => {
    setActiveDragNodeId(null);
  };

  const handleSynthesize = () => {
    const result = onSynthesizeHypothesis();
    if (result && result.isMatch && !result.alreadySolved) {
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#d4af37', '#a855f7', '#ffffff'],
      });
    }
  };

  const visibleNodes = pinboardNodes.filter(node => {
    const clue = CLUES[node.refId];
    if (!clue) return false;
    if (filterEra !== 'all' && clue.era !== filterEra) return false;
    return unlockedClueIds.includes(node.refId);
  });

  const getEraNodeTheme = (era: string) => {
    switch (era) {
      case '1926':
        return 'border-amber-500/60 bg-[#251b14]/95 text-amber-200 shadow-amber-950/50';
      case '2026':
        return 'border-cyan-500/60 bg-[#112338]/95 text-cyan-200 shadow-cyan-950/50';
      case '2156':
        return 'border-purple-500/60 bg-[#201138]/95 text-purple-200 shadow-purple-950/50';
      default:
        return 'border-white/20 bg-neutral-900 text-white';
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-col gap-4">
      {/* Board Controls & Synthesis Toolbar */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold mr-1">
            <Filter size={14} />
            <span>Filter Era:</span>
          </div>
          {['all', '1926', '2026', '2156'].map(era => (
            <button
              key={era}
              onClick={() => setFilterEra(era)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                filterEra === era
                  ? 'bg-neutral-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-black/40'
              }`}
            >
              {era === 'all' ? 'All Eras' : `Era ${era}`}
            </button>
          ))}
        </div>

        {/* Selected Clues Counter & Action */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-300 font-medium">
            <strong className="text-cyan-300 font-mono">{selectedNodeIds.length}</strong> Clues
            Selected
          </span>

          <button
            onClick={handleSynthesize}
            disabled={selectedNodeIds.length < 2}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              selectedNodeIds.length >= 2
                ? 'bg-gradient-to-r from-amber-500 via-cyan-500 to-purple-600 hover:opacity-90 text-black shadow-cyan-500/25 scale-105'
                : 'bg-neutral-800 text-neutral-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            <Lightbulb size={16} />
            <span>Synthesize 4D Hypothesis</span>
          </button>
        </div>
      </div>

      {/* Main Corkboard & Red-Yarn Graph Canvas */}
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[520px] rounded-3xl border border-white/15 overflow-hidden bg-[#100d0a] shadow-inner select-none cursor-crosshair"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Ambient Corkboard Lighting */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-transparent to-cyan-950/20 pointer-events-none" />

        {/* SVG Bezier Red-Yarn Strings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="yarnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
            <filter id="yarnGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {pinboardLinks.map(link => {
            const fromNode = pinboardNodes.find(n => n.id === link.fromNodeId);
            const toNode = pinboardNodes.find(n => n.id === link.toNodeId);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 90;
            const y1 = fromNode.y + 40;
            const x2 = toNode.x + 90;
            const y2 = toNode.y + 40;
            const dx = (x2 - x1) * 0.4;
            const dy = (y2 - y1) * 0.4;

            return (
              <g key={link.id}>
                {/* Shadow path */}
                <path
                  d={`M ${x1} ${y1} C ${x1 + dx} ${y1 + dy}, ${x2 - dx} ${y2 - dy}, ${x2} ${y2}`}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Active Glowing Yarn */}
                <path
                  d={`M ${x1} ${y1} C ${x1 + dx} ${y1 + dy}, ${x2 - dx} ${y2 - dy}, ${x2} ${y2}`}
                  stroke="url(#yarnGrad)"
                  strokeWidth="2.5"
                  fill="none"
                  filter="url(#yarnGlow)"
                  className="animate-yarn"
                />
              </g>
            );
          })}
        </svg>

        {/* Draggable Clue Cards */}
        {visibleNodes.map(node => {
          const clue = CLUES[node.refId];
          if (!clue) return null;
          const isSelected = selectedNodeIds.includes(node.id);
          const themeClass = getEraNodeTheme(clue.era);

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '185px',
                zIndex: isSelected ? 30 : 20,
              }}
              onMouseDown={e => handleMouseDown(e, node)}
              onClick={() => onToggleSelectNode(node.id)}
              className={`group p-2.5 rounded-2xl border-2 shadow-2xl backdrop-blur-md cursor-grab active:cursor-grabbing transition-shadow duration-200 ${themeClass} ${
                isSelected
                  ? 'ring-4 ring-cyan-400 scale-105 shadow-cyan-500/50'
                  : 'hover:scale-[1.02]'
              }`}
            >
              {/* Pushpin at Top Center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-red-600 border border-white shadow-md">
                <Pin size={12} className="text-white transform -rotate-45" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between mt-1 mb-1.5 border-b border-white/10 pb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80">
                  Era {clue.era}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-black/40 uppercase">
                  {clue.category}
                </span>
              </div>

              {/* Title & Detail */}
              <h4 className="text-xs font-bold leading-tight mb-1 text-neutral-100 line-clamp-2">
                {clue.title}
              </h4>
              <p className="text-[10px] opacity-75 line-clamp-2 leading-snug">
                {clue.description}
              </p>

              {/* Inspect Action Shortcut */}
              <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onInspectClue(clue);
                  }}
                  className="text-[10px] font-semibold text-cyan-300 hover:text-white flex items-center gap-1"
                >
                  <Info size={10} />
                  <span>Inspect Data</span>
                </button>

                {isSelected && (
                  <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-400/40">
                    LINKED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Solved Deduction Breakthroughs Section */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-neutral-100">
              Causal Deduction Milestones ({solvedDeductionIds.length}/4 Resolved)
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            {solvedDeductionIds.length * 25}% PARADOX SOLVED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEDUCTION_HYPOTHESES.map(hypo => {
            const isSolved = solvedDeductionIds.includes(hypo.id);

            return (
              <div
                key={hypo.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isSolved
                    ? 'bg-gradient-to-br from-purple-950/40 to-cyan-950/30 border-cyan-500/40 text-neutral-200'
                    : 'bg-neutral-950/40 border-white/5 text-neutral-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {isSolved ? (
                      <CheckCircle2 size={16} className="text-cyan-400" />
                    ) : (
                      <Lock size={14} />
                    )}
                    <h4 className="text-xs font-bold text-neutral-100">
                      Chapter {hypo.chapter}: {hypo.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5">
                    +{hypo.stabilityImpact}%
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed">
                  {isSolved ? hypo.narrativeRevelation : hypo.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
