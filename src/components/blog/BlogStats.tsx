import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { BlogStats } from "../../types";
import ContributionGraph from "./ContributionGraph";

interface BlogStatsComponentProps {
  stats: BlogStats;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const numberFormatter = new Intl.NumberFormat("zh-CN");

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const smallCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

function formatDateLabel(value: string | null): string {
  if (!value) return "等待发布";

  return new Date(value).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDaysAgo(days: number): string {
  if (days <= 0) return "今天更新";
  if (days === 1) return "1 天前更新";
  return `${days} 天前更新`;
}

const BlogStatsComponent: React.FC<BlogStatsComponentProps> = ({ stats }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, {
    amount: 0.15,
    margin: "-5% 0px -5% 0px",
  });
  const maxCategoryCount = Math.max(...stats.categories.map((category) => category.count), 1);

  return (
    <motion.div
      ref={rootRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex h-full w-full flex-col justify-center"
    >
      <div className="space-y-4">
        <motion.div variants={titleVariants}>
          <p className="mb-2 text-sm tracking-[0.24em] text-violet-300 uppercase">Blog Pulse</p>
          <h3 className="shine-text text-2xl font-bold md:text-3xl">把写作节奏做成首页的一部分</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            不只是显示总数，而是让访问者一眼看出最近有没有更新、内容覆盖了哪些主题，以及写作是否在持续发生。
          </p>
        </motion.div>

        <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.8fr)]">
          <motion.div
            variants={smallCardVariants}
            className="stats-summary-panel flex flex-col rounded-3xl p-4 md:p-5"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <MetricInline
                label="总博客数"
                value={stats.total}
                meta={`最近更新 ${formatDateLabel(stats.latestPublishedAt)}`}
                isVisible={isInView}
                delay={0.16}
              />
              <MetricInline
                label="累计字数"
                value={stats.totalWords}
                suffix="字"
                meta={`${numberFormatter.format(stats.categories.length)} 个主题`}
                isVisible={isInView}
                delay={0.22}
              />
              <MetricInline
                label="平均篇幅"
                value={stats.averageWords}
                suffix="字"
                meta={stats.total > 0 ? "按当前文章数估算" : "等待首篇文章"}
                isVisible={isInView}
                delay={0.28}
              />
              <MetricInline
                label="写作跨度"
                value={stats.publishingSpanDays}
                suffix="天"
                meta={formatDaysAgo(stats.daysSinceLastPost)}
                isVisible={isInView}
                delay={0.34}
              />
            </div>

            <div className="my-3 h-px w-full bg-linear-to-r from-transparent via-violet-300/35 to-transparent" />

            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {stats.timeline.map((item) => (
                <motion.div
                  key={item.label}
                  variants={smallCardVariants}
                  className="timeline-chip rounded-2xl px-3 py-2.5"
                >
                  <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                    {item.label}
                  </p>
                  <div className="mt-1.5 flex items-end justify-between gap-3">
                    <span className="text-lg font-semibold text-white md:text-xl">
                      {numberFormatter.format(item.count)}
                    </span>
                    <span className="text-xs text-slate-500">篇</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={smallCardVariants}
            className="topic-panel flex flex-col rounded-3xl p-4 md:p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">Topic Mix</p>
                <h4 className="mt-1.5 text-base font-semibold text-white md:text-lg">
                  当前主题分布
                </h4>
              </div>
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
                {numberFormatter.format(stats.categories.length)} 类
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-center space-y-2.5">
              {stats.categories.map((category) => (
                <div key={category.name} className="group relative">
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-100">{category.name}</span>
                    <span className="text-violet-200">{category.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-800/80">
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-violet-400 to-fuchsia-300 shadow-[0_0_10px_rgba(167,139,250,0.7)]"
                      initial={{ width: 0 }}
                      animate={
                        isInView
                          ? {
                              width: `${(category.count / maxCategoryCount) * 100}%`,
                            }
                          : { width: 0 }
                      }
                      transition={{
                        duration: 1.2,
                        delay: 0.4,
                        ease: EASE,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div variants={smallCardVariants} className="contribution-stage">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.2em] text-violet-300 uppercase">
                Contribution Grid
              </p>
              <h4 className="mt-1 text-lg font-semibold text-white md:text-xl">
                过去一年的发布热度
              </h4>
            </div>
            <p className="text-xs text-slate-400 md:text-sm">
              按日期分布，独立展示最近一年的写作轨迹
            </p>
          </div>

          <div className="mx-auto w-full">
            <ContributionGraph
              data={stats.dailyContributions}
              total={stats.dailyContributions.reduce((s, d) => s + d.count, 0)}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface MetricInlineProps {
  label: string;
  value: number;
  suffix?: string;
  meta?: string;
  isVisible: boolean;
  delay: number;
}

const MetricInline: React.FC<MetricInlineProps> = ({
  label,
  value,
  suffix,
  meta,
  isVisible,
  delay,
}) => {
  return (
    <motion.div variants={smallCardVariants} className="metric-inline">
      <p className="text-xs tracking-[0.16em] text-slate-400 uppercase md:text-sm">{label}</p>
      <CountUpNumber end={value} isVisible={isVisible} suffix={suffix} delay={delay} compact />
      {meta && <p className="mt-1.5 text-xs text-slate-500 md:text-sm">{meta}</p>}
    </motion.div>
  );
};

interface CountUpNumberProps {
  end: number;
  isVisible: boolean;
  suffix?: string;
  delay?: number;
  compact?: boolean;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  isVisible,
  suffix = "",
  delay = 0,
  compact = false,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    const duration = 1500;
    const startDelay = delay * 1000;
    let rafId: number;
    let startTime: number | null = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
      else setCount(end);
    };

    const timer = window.setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      window.clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible, end, delay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`count-number mt-1.5 font-bold ${compact ? "text-xl md:text-2xl" : "text-4xl md:text-5xl"}`}
    >
      {numberFormatter.format(count)}
      {suffix && (
        <span className={`ml-1 ${compact ? "text-base md:text-lg" : "text-2xl md:text-3xl"}`}>
          {suffix}
        </span>
      )}
    </motion.div>
  );
};

export default BlogStatsComponent;
