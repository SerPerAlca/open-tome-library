import { useState } from "react";
import { SkillTreeNode } from "@/types/hero-api";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface SkillTreeProps {
  nodes: SkillTreeNode[];
}

const SCALE = 1.8;
const NODE_RADIUS = 18;
const PADDING = 35;

const SkillTree = ({ nodes }: SkillTreeProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate SVG dimensions based on node positions
  const maxX = Math.max(...nodes.map(n => n.x)) * SCALE + PADDING * 2;
  const maxY = Math.max(...nodes.map(n => n.y)) * SCALE + PADDING * 2 + 40; // Extra space for labels

  // Create a map for quick node lookup
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Get scaled coordinates
  const getScaledCoords = (node: SkillTreeNode) => ({
    x: node.x * SCALE + PADDING,
    y: node.y * SCALE + PADDING,
  });

  return (
    <div className="space-y-2">
      <h4 className="font-display text-lg text-gold text-center mb-3 border-b border-gold/30 pb-2">
        ✦ Árbol de Habilidades ✦
      </h4>
      
      <TooltipPrimitive.Provider delayDuration={0}>
        <svg
          width="100%"
          height={maxY}
          viewBox={`0 0 ${maxX} ${maxY}`}
          className="overflow-visible"
        >
          {/* Connections */}
          {nodes.map(node => {
            const from = getScaledCoords(node);
            return node.connections.map(targetId => {
              const targetNode = nodeMap.get(targetId);
              if (!targetNode) return null;
              const to = getScaledCoords(targetNode);
              
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="hsl(43 70% 45% / 0.6)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              );
            });
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const coords = getScaledCoords(node);
            const isHovered = hoveredNode === node.id;

            return (
              <TooltipPrimitive.Root key={node.id}>
                <TooltipPrimitive.Trigger asChild>
                  <g
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                    style={{ pointerEvents: "all" }}
                  >
                    {/* Outer glow ring - always visible but more prominent on hover */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={NODE_RADIUS + 8}
                      fill="none"
                      stroke="hsl(43 70% 55%)"
                      strokeWidth={isHovered ? 3 : 0}
                      className={isHovered ? "skill-node-glow" : ""}
                      style={{
                        filter: isHovered ? "drop-shadow(0 0 20px hsl(43 70% 55%)) drop-shadow(0 0 30px hsl(43 70% 45%))" : "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                    
                    {/* Pulse ring animation on hover */}
                    {isHovered && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={NODE_RADIUS + 4}
                        fill="none"
                        stroke="hsl(43 70% 60%)"
                        strokeWidth="2"
                        className="skill-node-pulse"
                      />
                    )}
                    
                    {/* Node circle */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={NODE_RADIUS}
                      fill={isHovered ? "hsl(43 70% 50%)" : "hsl(25 45% 22%)"}
                      stroke="hsl(43 70% 45%)"
                      strokeWidth="2.5"
                      style={{
                        transition: "all 0.2s ease",
                        filter: isHovered ? "drop-shadow(0 0 20px hsl(43 70% 55%))" : "none",
                        transform: isHovered ? `scale(1.1)` : "scale(1)",
                        transformOrigin: `${coords.x}px ${coords.y}px`,
                      }}
                    />
                    
                    {/* Node label */}
                    <text
                      x={coords.x}
                      y={coords.y + NODE_RADIUS + 30}
                      textAnchor="middle"
                      className="font-body"
                      style={{ 
                        fill: "hsl(43 70% 50%)",
                        fontSize: "18px",
                        fontWeight: "600",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      {node.label}
                    </text>
                  </g>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                  <TooltipPrimitive.Content
                    side="top"
                    sideOffset={12}
                    className={cn(
                      "z-[99999] overflow-hidden rounded-md bg-spine px-3 py-1.5 text-sm text-gold border border-gold/50 font-body",
                      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                    )}
                  >
                    <p>{node.tooltip}</p>
                    <TooltipPrimitive.Arrow className="fill-spine" />
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
              </TooltipPrimitive.Root>
            );
          })}
        </svg>
      </TooltipPrimitive.Provider>
    </div>
  );
};

export default SkillTree;
