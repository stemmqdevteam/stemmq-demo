"use client";

import { motion } from "framer-motion";

export function StrategyVisualization() {
  return (
    <section className="py-20 sm:py-28 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-80 sm:h-96 flex items-center justify-center order-2 lg:order-1"
          >
            <svg viewBox="0 0 400 300" className="w-full h-full max-w-md mx-auto">
              {/* Animated edges */}
              {[
                { x1: 200, y1: 50, x2: 100, y2: 130 },
                { x1: 200, y1: 50, x2: 300, y2: 130 },
                { x1: 100, y1: 130, x2: 60, y2: 220 },
                { x1: 100, y1: 130, x2: 140, y2: 220 },
                { x1: 300, y1: 130, x2: 260, y2: 220 },
                { x1: 300, y1: 130, x2: 340, y2: 220 },
                { x1: 200, y1: 50, x2: 200, y2: 130 },
                { x1: 200, y1: 130, x2: 200, y2: 220 },
              ].map((line, i) => (
                <motion.line
                  key={i}
                  x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-border"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                />
              ))}

              {/* Decision node (center top) */}
              <motion.g initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, type: "spring" }}>
                <circle cx="200" cy="50" r="20" className="fill-accent/20 stroke-accent" strokeWidth="2" />
                <text x="200" y="54" textAnchor="middle" className="fill-accent text-[10px] font-bold">D1</text>
              </motion.g>

              {/* Assumption nodes */}
              {[{ cx: 100, cy: 130 }, { cx: 200, cy: 130 }, { cx: 300, cy: 130 }].map((n, i) => (
                <motion.g key={i} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1, type: "spring" }}>
                  <circle cx={n.cx} cy={n.cy} r="16" className="fill-success/20 stroke-success" strokeWidth="2" />
                  <text x={n.cx} y={n.cy + 4} textAnchor="middle" className="fill-success text-[9px] font-bold">A{i + 1}</text>
                </motion.g>
              ))}

              {/* Outcome nodes */}
              {[60, 140, 200, 260, 340].map((cx, i) => (
                <motion.g key={i} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.08, type: "spring" }}>
                  <circle cx={cx} cy={220} r="12" className="fill-warning/20 stroke-warning" strokeWidth="1.5" />
                  <text x={cx} y={224} textAnchor="middle" className="fill-warning text-[8px] font-bold">O{i + 1}</text>
                </motion.g>
              ))}

              {/* Legend */}
              <g transform="translate(100, 270)">
                <circle cx="0" cy="0" r="5" className="fill-accent/30" />
                <text x="10" y="4" className="fill-muted-foreground text-[9px]">Decisions</text>
                <circle cx="80" cy="0" r="5" className="fill-success/30" />
                <text x="90" y="4" className="fill-muted-foreground text-[9px]">Assumptions</text>
                <circle cx="175" cy="0" r="5" className="fill-warning/30" />
                <text x="185" y="4" className="fill-muted-foreground text-[9px]">Outcomes</text>
              </g>
            </svg>
          </motion.div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Strategy Graph</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">See the full picture</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every decision exists in a network. StemmQ&apos;s Strategy Graph reveals how decisions, assumptions, and outcomes connect — helping you identify dependencies, cascading risks, and strategic opportunities.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Interactive node-edge visualization",
                "Filter by decision type, status, or owner",
                "Click any node for full context",
                "Identify assumption clusters and risk concentrations",
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
