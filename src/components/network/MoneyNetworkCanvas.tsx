import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAml } from '../../context/AmlContext';
import { Transaction, AccountInfo } from '../../types/aml';
import { formatINR } from '../../logic/formatters';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Filter, 
  Eye, 
  Building2, 
  ShieldAlert, 
  User, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface NodePos {
  id: string;
  name: string;
  risk: string;
  type: string;
  x: number;
  y: number;
  isSuspicious: boolean;
}

interface EdgeLink {
  from: string;
  to: string;
  amount: number;
  tx: Transaction;
  isSuspicious: boolean;
}

export const MoneyNetworkCanvas: React.FC = () => {
  const { 
    transactions, 
    accounts, 
    inspectAccountById, 
    setSelectedTransaction,
    selectedAccount
  } = useAml();

  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport transforms
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Filters
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState(false);
  const [highlightedChain, setHighlightedChain] = useState<string[]>(['A101', 'B205', 'C301', 'D410', 'E512']);

  // Node Dragging
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<{ [id: string]: { x: number; y: number } }>({});

  // Prepare graph data
  const { nodes, edges } = useMemo(() => {
    const suspiciousTxIds = new Set(
      transactions.filter(t => t.risk === 'CRITICAL' || t.risk === 'HIGH').map(t => t.id)
    );
    const suspiciousAccountIds = new Set<string>();
    transactions.forEach(t => {
      if (suspiciousTxIds.has(t.id)) {
        suspiciousAccountIds.add(t.fromAccount);
        suspiciousAccountIds.add(t.toAccount);
      }
    });

    // Edges
    const linkList: EdgeLink[] = [];
    transactions.forEach(tx => {
      const isSusp = suspiciousTxIds.has(tx.id);
      if (showSuspiciousOnly && !isSusp) return;
      linkList.push({
        from: tx.fromAccount,
        to: tx.toAccount,
        amount: tx.amount,
        tx,
        isSuspicious: isSusp
      });
    });

    // Nodes
    const activeAccountIds = new Set<string>();
    linkList.forEach(l => {
      activeAccountIds.add(l.from);
      activeAccountIds.add(l.to);
    });

    const nodeList: NodePos[] = [];
    activeAccountIds.forEach(accId => {
      const acc = accounts.find(a => a.id === accId);
      const isSusp = suspiciousAccountIds.has(accId);

      // Default layout coordinates if not yet customized
      let defaultX = 400;
      let defaultY = 300;

      // Layout primary demo chain horizontally centered
      if (accId === 'A101') { defaultX = 140; defaultY = 220; }
      else if (accId === 'B205') { defaultX = 330; defaultY = 220; }
      else if (accId === 'C301') { defaultX = 520; defaultY = 220; }
      else if (accId === 'D410') { defaultX = 710; defaultY = 220; }
      else if (accId === 'E512') { defaultX = 900; defaultY = 220; }
      // Circular chain
      else if (accId === 'P100') { defaultX = 220; defaultY = 460; }
      else if (accId === 'Q200') { defaultX = 450; defaultY = 460; }
      else if (accId === 'R300') { defaultX = 335; defaultY = 560; }
      // Rapid smurfing chain
      else if (accId === 'M101') { defaultX = 640; defaultY = 450; }
      else if (accId === 'M202') { defaultX = 780; defaultY = 450; }
      else if (accId === 'M303') { defaultX = 920; defaultY = 450; }
      else if (accId === 'M404') { defaultX = 1060; defaultY = 450; }
      // Normal accounts
      else if (accId === 'CORP-77') { defaultX = 350; defaultY = 80; }
      else if (accId === 'VENDOR-99') { defaultX = 650; defaultY = 80; }
      else if (accId === 'RETAIL-88') { defaultX = 900; defaultY = 80; }
      else if (accId === 'EMP-01') { defaultX = 180; defaultY = 80; }
      else if (accId === 'EMP-02') { defaultX = 480; defaultY = 120; }
      else if (accId === 'CUST-10') { defaultX = 800; defaultY = 120; }

      nodeList.push({
        id: accId,
        name: acc?.name || `Account ${accId}`,
        risk: acc?.risk || (isSusp ? 'HIGH' : 'LOW'),
        type: acc?.type || 'CORPORATE',
        x: nodePositions[accId]?.x ?? defaultX,
        y: nodePositions[accId]?.y ?? defaultY,
        isSuspicious: isSusp
      });
    });

    return { nodes: nodeList, edges: linkList };
  }, [transactions, accounts, showSuspiciousOnly, nodePositions]);

  // Handle Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'svg' && (e.target as HTMLElement).tagName !== 'rect') return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggingNodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - pan.x) / zoom;
      const currentY = (e.clientY - rect.top - pan.y) / zoom;
      setNodePositions(prev => ({
        ...prev,
        [draggingNodeId]: { x: currentX, y: currentY }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(2.2, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, z - 0.15));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setNodePositions({});
  };
  const handleFitNetwork = () => {
    setZoom(0.88);
    setPan({ x: 20, y: 30 });
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden select-none flex flex-col">
      
      {/* Top Controls Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left: Filter switch */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xs px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter View:</span>
          </span>
          <button
            onClick={() => setShowSuspiciousOnly(false)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              !showSuspiciousOnly 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Show All ({transactions.length})
          </button>
          <button
            onClick={() => setShowSuspiciousOnly(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              showSuspiciousOnly 
                ? 'bg-red-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Suspicious Only
          </button>
        </div>

        {/* Center: Main Demo Highlight Indicator */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold text-slate-700">Flagged Chain:</span>
          <span className="font-mono font-bold text-red-600">A101 → B205 → C301 → D410 → E512</span>
          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">CRITICAL</span>
        </div>

        {/* Right: Zoom & Position Controls */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitNetwork}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Fit Network"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Graph"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* SVG Canvas */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(#e2e8f0 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px'
          }}
        >
          <defs>
            {/* Standard arrow marker */}
            <marker
              id="arrow-normal"
              viewBox="0 0 10 10"
              refX="28"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>

            {/* Suspicious critical red arrow marker */}
            <marker
              id="arrow-critical"
              viewBox="0 0 10 10"
              refX="28"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0.5 L 10 5 L 0 9.5 z" fill="#ef4444" />
            </marker>
          </defs>

          {/* Scalable Container Group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            
            {/* Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              // Check if in main demo chain
              const isMainChain = (
                (edge.from === 'A101' && edge.to === 'B205') ||
                (edge.from === 'B205' && edge.to === 'C301') ||
                (edge.from === 'C301' && edge.to === 'D410') ||
                (edge.from === 'D410' && edge.to === 'E512')
              );

              // Calculate curvature or midpoints
              const dx = toNode.x - fromNode.x;
              const dy = toNode.y - fromNode.y;
              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              // Slight arc for clarity
              const pathD = `M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY - 15} ${toNode.x} ${toNode.y}`;

              const strokeColor = edge.isSuspicious ? '#ef4444' : '#cbd5e1';
              const strokeWidth = isMainChain ? 3.5 : (edge.isSuspicious ? 2.5 : 1.5);

              return (
                <g key={`edge-${edge.tx.id}-${idx}`} className="group cursor-pointer">
                  {/* Outer glow line for suspicious transfers */}
                  {edge.isSuspicious && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#fee2e2"
                      strokeWidth={strokeWidth + 4}
                      opacity="0.8"
                    />
                  )}

                  {/* Main Flow Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isMainChain ? '6,3' : undefined}
                    className={isMainChain ? 'animate-pulse' : ''}
                    markerEnd={edge.isSuspicious ? 'url(#arrow-critical)' : 'url(#arrow-normal)'}
                  />

                  {/* Transaction Amount Badge on Connection */}
                  <g 
                    transform={`translate(${midX}, ${midY - 12})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTransaction(edge.tx);
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <rect
                      x="-42"
                      y="-12"
                      width="84"
                      height="22"
                      rx="11"
                      fill={edge.isSuspicious ? '#fff' : '#f8fafc'}
                      stroke={edge.isSuspicious ? '#ef4444' : '#94a3b8'}
                      strokeWidth={edge.isSuspicious ? '1.5' : '1'}
                      className="shadow-sm"
                    />
                    <text
                      x="0"
                      y="2.5"
                      textAnchor="middle"
                      className={`text-[10px] font-bold ${
                        edge.isSuspicious ? 'fill-red-600 font-mono' : 'fill-slate-700 font-mono'
                      }`}
                    >
                      {formatINR(edge.amount, true)}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const isSelected = selectedAccount?.id === node.id;
              const isCritical = node.risk === 'CRITICAL';
              const isHigh = node.risk === 'HIGH';

              let borderColor = '#94a3b8';
              let ringColor = 'transparent';
              let fillBg = '#ffffff';

              if (isCritical) {
                borderColor = '#ef4444';
                ringColor = '#fee2e2';
              } else if (isHigh) {
                borderColor = '#f97316';
                ringColor = '#ffedd5';
              } else {
                borderColor = '#10b981';
                ringColor = '#d1fae5';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingNodeId(node.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    inspectAccountById(node.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Pulsing Aura for Critical Nodes */}
                  {(isCritical || isSelected) && (
                    <circle
                      r="32"
                      fill={ringColor}
                      opacity="0.7"
                      className="animate-pulse"
                    />
                  )}

                  {/* Outer Circle Node */}
                  <circle
                    r="24"
                    fill={fillBg}
                    stroke={borderColor}
                    strokeWidth={isSelected ? '3.5' : (isCritical ? '2.5' : '1.8')}
                    className="shadow-md transition-all group-hover:scale-110"
                  />

                  {/* Icon Indicator inside Node */}
                  <g transform="translate(-8, -8)" className="pointer-events-none">
                    {node.type === 'SHELL_COMPANY' ? (
                      <ShieldAlert className={`w-4 h-4 ${isCritical ? 'text-red-600' : 'text-orange-500'}`} />
                    ) : node.type === 'INDIVIDUAL' ? (
                      <User className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Building2 className={`w-4 h-4 ${isCritical ? 'text-red-600' : 'text-blue-600'}`} />
                    )}
                  </g>

                  {/* Account ID Label */}
                  <text
                    y="36"
                    textAnchor="middle"
                    className="font-mono text-xs font-extrabold fill-slate-900 pointer-events-none tracking-tight"
                  >
                    {node.id}
                  </text>

                  {/* Short Name / Subtitle */}
                  <text
                    y="48"
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-slate-500 pointer-events-none"
                  >
                    {node.name.length > 18 ? `${node.name.substring(0, 16)}…` : node.name}
                  </text>

                  {/* Risk Badge Pill */}
                  {node.isSuspicious && (
                    <g transform="translate(0, -28)">
                      <rect
                        x="-20"
                        y="-8"
                        width="40"
                        height="14"
                        rx="7"
                        fill={isCritical ? '#ef4444' : '#f97316'}
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        className="text-[8px] font-bold fill-white tracking-wider uppercase"
                      >
                        {node.risk}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          </g>
        </svg>
      </div>

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3 text-xs bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200" />
            <span>Critical Shell Entity (Tier 1)</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>High Risk Entity</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Normal / Corporate</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-4 h-0.5 bg-red-500 border-b border-dashed border-red-500" />
            <span>Layering Flow Arrow</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 italic">
          💡 Click any node for Account Intelligence. Click any connection amount to view transaction audit.
        </div>
      </div>

    </div>
  );
};
