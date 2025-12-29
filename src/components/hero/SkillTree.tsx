import { useState } from "react";
import { SkillTreeNode } from "@/types/hero-api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillTreeProps {
  nodes: SkillTreeNode[];
}

const SCALE = 1.8;
const NODE_RADIUS = 18;
const PADDING = 30;

const SkillTree = ({ nodes }: SkillTreeProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate SVG dimensions based on node positions
  const maxX = Math.max(...nodes.map(n => n.x)) * SCALE + PADDING * 2;
  const maxY = Math.max(...nodes.map(n => n.y)) * SCALE + PADDING * 2;

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
      
      <TooltipProvider delayDuration={100}>
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
              <Tooltip key={node.id}>
                <TooltipTrigger asChild>
                  <g
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    {/* Glow effect */}
                    {isHovered && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={NODE_RADIUS + 6}
                        fill="none"
                        stroke="hsl(43 70% 55%)"
                        strokeWidth="2"
                        className="animate-pulse"
                        style={{
                          filter: "drop-shadow(0 0 8px hsl(43 70% 55%))",
                        }}
                      />
                    )}
                    
                    {/* Node circle */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={NODE_RADIUS}
                      fill={isHovered ? "hsl(43 70% 45%)" : "hsl(25 45% 22%)"}
                      stroke="hsl(43 70% 45%)"
                      strokeWidth="2"
                      style={{
                        transition: "all 0.2s ease",
                        filter: isHovered ? "drop-shadow(0 0 6px hsl(43 70% 55%))" : "none",
                      }}
                    />
                    
                    {/* Node label */}
                    <text
                      x={coords.x}
                      y={coords.y + NODE_RADIUS + 14}
                      textAnchor="middle"
                      className="font-body text-xs fill-current"
                      style={{ fill: "hsl(43 70% 45%)" }}
                    >
                      {node.label}
                    </text>
                  </g>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-spine text-gold border-gold/50 font-body"
                >
                  <p>{node.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>
      </TooltipProvider>
    </div>
  );
};

export default SkillTree;
