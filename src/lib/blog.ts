import { getCollection } from "astro:content";
import type { BlogStats } from "../types";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export async function calculateBlogStats(): Promise<BlogStats> {
  try {
    const allPosts = await getCollection("blog");

    // 按日期排序
    const sortedPosts = allPosts.sort(
      (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    );

    // 计算总字数（简单估算：每个 markdown 字符）
    const totalWords = sortedPosts.reduce((acc, post) => {
      return acc + (post.body ? post.body.length : 0);
    }, 0);

    const latestPostDate = sortedPosts[0] ? normalizeDate(sortedPosts[0].data.date) : null;
    const firstPostDate = sortedPosts.at(-1) ? normalizeDate(sortedPosts.at(-1)!.data.date) : null;

    // 按分类统计
    const categoryMap = new Map<string, number>();
    sortedPosts.forEach((post) => {
      const tags = post.data.tags || [];
      const category = post.data.category || "未分类";

      if (Array.isArray(tags) && tags.length > 0) {
        tags.forEach((tag: string) => {
          categoryMap.set(tag, (categoryMap.get(tag) || 0) + 1);
        });
      } else {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      }
    });

    const categories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 按时间统计
    const now = new Date();
    const timeline = [
      {
        label: "本周",
        count: sortedPosts.filter((post) => {
          const postDate = new Date(post.data.date);
          const daysDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        }).length,
      },
      {
        label: "本月",
        count: sortedPosts.filter((post) => {
          const postDate = new Date(post.data.date);
          const daysDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30;
        }).length,
      },
      {
        label: "本季度",
        count: sortedPosts.filter((post) => {
          const postDate = new Date(post.data.date);
          const daysDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 90;
        }).length,
      },
      {
        label: "本年",
        count: sortedPosts.filter((post) => {
          const postDate = new Date(post.data.date);
          const daysDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 365;
        }).length,
      },
    ];

    return {
      total: sortedPosts.length,
      totalWords,
      averageWords: sortedPosts.length > 0 ? Math.round(totalWords / sortedPosts.length) : 0,
      firstPublishedAt: firstPostDate ? toDateKey(firstPostDate) : null,
      latestPublishedAt: latestPostDate ? toDateKey(latestPostDate) : null,
      publishingSpanDays:
        firstPostDate && latestPostDate ? diffDays(firstPostDate, latestPostDate) + 1 : 0,
      daysSinceLastPost: latestPostDate ? diffDays(latestPostDate, now) : 0,
      categories:
        categories.length > 0 ? categories : [{ name: "全部", count: sortedPosts.length }],
      timeline,
      dailyContributions: buildDailyContributions(sortedPosts),
    };
  } catch (error) {
    console.error("Error calculating blog stats:", error);
    return {
      total: 0,
      totalWords: 0,
      averageWords: 0,
      firstPublishedAt: null,
      latestPublishedAt: null,
      publishingSpanDays: 0,
      daysSinceLastPost: 0,
      categories: [],
      timeline: [
        { label: "本周", count: 0 },
        { label: "本月", count: 0 },
        { label: "本季度", count: 0 },
        { label: "本年", count: 0 },
      ],
      dailyContributions: buildDailyContributions([]),
    };
  }
}

function normalizeDate(value: Date | string): Date {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function diffDays(from: Date, to: Date): number {
  return Math.max(
    0,
    Math.floor((normalizeDate(to).getTime() - normalizeDate(from).getTime()) / DAY_IN_MS)
  );
}

function buildDailyContributions(
  posts: { data: { date: Date | string } }[]
): { date: string; count: number }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 回溯 52 周 + 本周剩余天数，让最后一列对齐今天所在周
  const end = new Date(today);
  const start = new Date(today);
  start.setDate(start.getDate() - (52 * 7 + today.getDay()));

  const counts = new Map<string, number>();
  for (const post of posts) {
    const d = normalizeDate(post.data.date);
    if (d < start || d > end) continue;
    const key = toDateKey(d);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const result: { date: string; count: number }[] = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const key = toDateKey(cursor);
    result.push({ date: key, count: counts.get(key) || 0 });
  }
  return result;
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getLatestPostLink(): string {
  return "/blog";
}
