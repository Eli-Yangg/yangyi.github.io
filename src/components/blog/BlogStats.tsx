import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { BlogStats } from "../../types";
import ContributionGraph from "./ContributionGraph";

interface BlogStatsComponentProps {
  stats: BlogStats;
  isVisible?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

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

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
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

const BlogStatsComponent: React.FC<BlogStatsComponentProps> = ({ stats }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, {
    amount: 0.15,
    margin: "-5% 0px -5% 0px",
  });

  return (
    <motion.div
      ref={rootRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="w-full"
    >
      {/* 总体统计 */}
      <div className="mb-8">
        <motion.h3
          variants={titleVariants}
          className="shine-text mb-6 text-center text-2xl font-bold md:text-3xl"
        >
          博客统计
        </motion.h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <HeroStatCard label="总博客数" value={stats.total} isVisible={isInView} index={0} />
          <HeroStatCard
            label="总字数"
            value={stats.totalWords}
            suffix="字"
            isVisible={isInView}
            index={1}
          />
          <HeroStatCard
            label="分类数"
            value={stats.categories.length}
            isVisible={isInView}
            index={2}
          />
        </div>
      </div>

      {/* 按创建时间统计（GitHub 风格贡献图） */}
      <div className="mb-8">
        <motion.h3
          variants={titleVariants}
          className="mb-4 bg-linear-to-r from-white to-violet-200 bg-clip-text text-lg font-semibold text-transparent"
        >
          按创建时间统计
        </motion.h3>
        <motion.div variants={smallCardVariants}>
          <ContributionGraph
            data={stats.dailyContributions}
            total={stats.dailyContributions.reduce((s, d) => s + d.count, 0)}
          />
        </motion.div>
      </div>

      {/* 按分类统计 */}
      <div>
        <motion.h3
          variants={titleVariants}
          className="mb-4 bg-linear-to-r from-white to-violet-200 bg-clip-text text-lg font-semibold text-transparent"
        >
          按分类统计
        </motion.h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {stats.categories.map((category) => (
            <motion.div
              key={category.name}
              variants={smallCardVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="stat-mini-card group relative flex items-center justify-between overflow-hidden rounded-xl p-4"
            >
              <span className="relative z-10 text-sm font-medium text-slate-50">
                {category.name}
              </span>
              <div className="relative z-10 flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-700/60">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-violet-400 to-fuchsia-300 shadow-[0_0_10px_rgba(167,139,250,0.7)]"
                    initial={{ width: 0 }}
                    animate={
                      isInView
                        ? {
                            width: `${(category.count / stats.total) * 100}%`,
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
                <span className="min-w-8 text-right text-sm font-semibold text-violet-200">
                  {category.count}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface HeroStatCardProps {
  label: string;
  value: number;
  suffix?: string;
  isVisible: boolean;
  index: number;
}

const HeroStatCard: React.FC<HeroStatCardProps> = ({ label, value, suffix, isVisible, index }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="stat-hero-card group relative overflow-hidden rounded-2xl p-6"
    >
      {/* 柔和径向光晕 */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-violet-500/40 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-16 -bottom-20 h-48 w-48 rounded-full bg-fuchsia-500/30 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* shimmer 高光扫过 */}
      <div className="shimmer pointer-events-none absolute inset-0" />

      <div className="relative z-10">
        <p className="text-sm tracking-wide text-slate-300/90">{label}</p>
        <CountUpNumber
          end={value}
          isVisible={isVisible}
          suffix={suffix}
          delay={0.2 + index * 0.12}
        />
        <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-violet-300/50 to-transparent" />
      </div>
    </motion.div>
  );
};

interface CountUpNumberProps {
  end: number;
  isVisible: boolean;
  suffix?: string;
  delay?: number;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  isVisible,
  suffix = "",
  delay = 0,
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
      className="count-number mt-2 text-4xl font-bold md:text-5xl"
    >
      {count}
      {suffix && <span className="ml-1 text-2xl md:text-3xl">{suffix}</span>}
    </motion.div>
  );
};

export default BlogStatsComponent;
