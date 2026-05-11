export interface BlogStats {
  total: number;
  totalWords: number;
  averageWords: number;
  firstPublishedAt: string | null;
  latestPublishedAt: string | null;
  publishingSpanDays: number;
  daysSinceLastPost: number;
  categories: {
    name: string;
    count: number;
  }[];
  timeline: {
    label: string;
    count: number;
  }[];
  dailyContributions: {
    date: string;
    count: number;
  }[];
}

export interface BlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    date: string;
  };
}
