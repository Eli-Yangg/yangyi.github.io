import React, { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface DailyContribution {
  date: string;
  count: number;
}

interface ContributionGraphProps {
  data: DailyContribution[];
  total: number;
}

const WEEKS = 53;
const DAYS = 7;
const WEEK_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function levelOf(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  "bg-slate-800/60 border border-slate-700/40",
  "bg-violet-900/60 border border-violet-700/40",
  "bg-violet-600/70 border border-violet-500/50",
  "bg-violet-500 border border-violet-400/60 shadow-[0_0_6px_rgba(167,139,250,0.5)]",
  "bg-fuchsia-400 border border-fuchsia-300/70 shadow-[0_0_8px_rgba(232,121,249,0.6)]",
];

interface TooltipState {
  x: number;
  y: number;
  date: string;
  count: number;
  align: 'center' | 'right';
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ data, total }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { amount: 0.2, margin: "-5% 0px" });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const { weeks, monthLabels } = useMemo(() => {
    const weeks: (DailyContribution | null)[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      const col: (DailyContribution | null)[] = [];
      for (let d = 0; d < DAYS; d++) {
        const idx = w * DAYS + d;
        col.push(data[idx] ?? null);
      }
      weeks.push(col);
    }
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((col, i) => {
      const firstDay = col.find((c) => c) || null;
      if (!firstDay) return;
      const m = new Date(firstDay.date).getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        labels.push({
          weekIndex: i,
          label: new Date(firstDay.date).toLocaleString("en-US", {
            month: "short",
          }),
        });
      }
    });
    return { weeks, monthLabels: labels };
  }, [data]);

  const handleCellEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    cell: DailyContribution
  ) => {
    const container = gridRef.current;
    if (!container) return;
    const crect = container.getBoundingClientRect();
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = r.left - crect.left + r.width / 2;
    const align = x > crect.width * 0.8 ? 'right' : 'center';
    setTooltip({
      x,
      y: r.top - crect.top,
      date: cell.date,
      count: cell.count,
      align,
    });
  };

  const handleCellLeave = () => setTooltip(null);

  return (
    <div
      ref={rootRef}
      className="contrib-card relative overflow-hidden rounded-2xl p-4 md:p-5"
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">
        <p className="text-sm text-slate-300/80">
          过去一年共 <span className="font-bold text-violet-200">{total}</span>{" "}
          篇文章
        </p>
        <div className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
          <span>Less</span>
          {LEVEL_CLASSES.map((cls, i) => (
            <span key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* 图本体：flex-1 均分占满容器宽度 */}
      <div ref={gridRef} className="relative z-10 mt-3 w-full">
        {/* 月份轴 */}
        <div className="flex pl-8">
          {weeks.map((_, wi) => {
            const label = monthLabels.find((l) => l.weekIndex === wi);
            return (
              <div
                key={wi}
                className="relative flex-1 text-[10px] text-slate-400"
                style={{ paddingRight: 2 }}
              >
                {label && (
                  <span className="whitespace-nowrap">{label.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 主体：星期标签 + 格子区 */}
        <div className="mt-1 flex w-full gap-1.5">
          {/* 星期标签 */}
          <div className="flex w-6 flex-col justify-between py-[1px] text-[10px] text-slate-400">
            {WEEK_LABELS.map((l, i) => (
              <div key={i} className="leading-none">
                {l}
              </div>
            ))}
          </div>

          {/* 格子区 */}
          <motion.div
            className="flex flex-1 gap-[2px]"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.01 } },
            }}
          >
            {weeks.map((col, wi) => (
              <motion.div
                key={wi}
                className="flex flex-1 flex-col gap-[2px]"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.005 } },
                }}
              >
                {col.map((cell, di) => {
                  const lvl = cell ? levelOf(cell.count) : 0;
                  return (
                    <motion.div
                      key={di}
                      variants={{
                        hidden: { opacity: 0, scale: 0.3 },
                        visible: {
                          opacity: cell ? 1 : 0.35,
                          scale: 1,
                          transition: {
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1] as const,
                          },
                        },
                      }}
                      whileHover={{ scale: 1.35, zIndex: 10 }}
                      onMouseEnter={(e) => cell && handleCellEnter(e, cell)}
                      onMouseLeave={handleCellLeave}
                      className={`aspect-square w-full rounded-[3px] ${LEVEL_CLASSES[lvl]} cursor-pointer`}
                    />
                  );
                })}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 自定义 tooltip */}
        {tooltip && (
          <div
            className={`pointer-events-none absolute z-30 -translate-y-full whitespace-nowrap rounded-lg border border-violet-500/30 bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md ${
              tooltip.align === 'right' ? '-translate-x-full' : '-translate-x-1/2'
            }`}
            style={{ left: tooltip.x, top: tooltip.y - 6 }}
          >
            <div className="font-semibold text-violet-200">{tooltip.date}</div>
            <div className="mt-0.5 text-slate-300">
              {tooltip.count} 篇文章
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionGraph;
