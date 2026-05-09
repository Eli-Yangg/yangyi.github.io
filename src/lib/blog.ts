import { getCollection } from "astro:content";
import type { BlogStats } from "../types";

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
      categories: categories.length > 0 ? categories : [{ name: "全部", count: sortedPosts.length }],
      timeline,
    };
  } catch (error) {
    console.error("Error calculating blog stats:", error);
    return {
      total: 0,
      totalWords: 0,
      categories: [],
      timeline: [
        { label: "本周", count: 0 },
        { label: "本月", count: 0 },
        { label: "本季度", count: 0 },
        { label: "本年", count: 0 },
      ],
    };
  }
}

export function getLatestPostLink(): string {
  return "/blog";
}
