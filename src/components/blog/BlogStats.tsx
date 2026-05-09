import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { BlogStats } from "../../types";

interface BlogStatsComponentProps {
  stats: BlogStats;
  isVisible: boolean;
}

const BlogStatsComponent: React.FC<BlogStatsComponentProps> = ({
  stats,
  isVisible: initialIsVisible,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = document.querySelector('[data-stats-section]');
    if (!element) {
      setIsVisible(initialIsVisible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [initialIsVisible]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      transition: {
        duration: 1.5,
        delay: custom * 0.1,
      },
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="w-full"
    >
      {/* 总体统计 */}
      <div className="mb-16">
        <motion.h3
          variants={itemVariants}
          className="mb-8 text-center text-3xl font-bold md:text-4xl"
        >
          博客统计
        </motion.h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* 总博客数 */}
          <motion.div
            variants={itemVariants}
            className="glass group rounded-2xl border border-violet-500/20 p-8 backdrop-blur-xl transition hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
          >
            <p className="text-sm text-slate-400">总博客数</p>
            <CountUpNumber
              end={stats.total}
              isVisible={isVisible}
              custom={0}
              variants={numberVariants}
            />
          </motion.div>

          {/* 总字数 */}
          <motion.div
            variants={itemVariants}
            className="glass group rounded-2xl border border-violet-500/20 p-8 backdrop-blur-xl transition hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
          >
            <p className="text-sm text-slate-400">总字数</p>
            <CountUpNumber
              end={stats.totalWords}
              isVisible={isVisible}
              custom={1}
              variants={numberVariants}
              suffix="字"
            />
          </motion.div>

          {/* 分类数 */}
          <motion.div
            variants={itemVariants}
            className="glass group rounded-2xl border border-violet-500/20 p-8 backdrop-blur-xl transition hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20"
          >
            <p className="text-sm text-slate-400">分类数</p>
            <CountUpNumber
              end={stats.categories.length}
              isVisible={isVisible}
              custom={2}
              variants={numberVariants}
            />
          </motion.div>
        </div>
      </div>

      {/* 按时间统计 */}
      <div className="mb-16">
        <motion.h3
          variants={itemVariants}
          className="mb-8 text-xl font-semibold"
        >
          按创建时间统计
        </motion.h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.timeline.map((item, index) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="glass rounded-xl border border-violet-500/20 p-4 backdrop-blur-xl transition hover:border-violet-500/40"
            >
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-violet-400">
                {item.count}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 按分类统计 */}
      <div>
        <motion.h3
          variants={itemVariants}
          className="mb-8 text-xl font-semibold"
        >
          按分类统计
        </motion.h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {stats.categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={itemVariants}
              className="glass flex items-center justify-between rounded-lg border border-violet-500/20 p-4 backdrop-blur-xl transition hover:border-violet-500/40"
            >
              <span className="text-sm font-medium">{category.name}</span>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-300"
                    initial={{ width: 0 }}
                    animate={isVisible ? { width: `${(category.count / stats.total) * 100}%` } : { width: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  />
                </div>
                <span className="min-w-8 text-right text-sm font-semibold text-violet-400">
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

interface CountUpNumberProps {
  end: number;
  isVisible: boolean;
  custom: number;
  variants: any;
  suffix?: string;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  isVisible,
  custom,
  variants,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let start = 0;
    const duration = 1.5;
    const increment = end / (duration * 60);
    let animationFrame: number;

    const animate = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end]);

  return (
    <motion.div
      custom={custom}
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="mt-3 text-4xl font-bold text-transparent md:text-5xl"
      style={{
        backgroundImage:
          "linear-gradient(to right, #a78bfa, #c084fc, #e879f9)",
        backgroundClip: "text",
      }}
    >
      {count}
      {suffix}
    </motion.div>
  );
};

export default BlogStatsComponent;
