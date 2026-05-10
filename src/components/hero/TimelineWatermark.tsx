import React from "react";

interface TimelineItem {
  date: string;
  title: string;
  tag: string;
}

const MOCK_TIMELINE: TimelineItem[] = [
  { date: "2026.05", title: "Timeline Watermark", tag: "now" },
  { date: "2026.01", title: "AI Search Beta", tag: "ai" },
  { date: "2025.10", title: "SEO Optimization", tag: "seo" },
  { date: "2025.07", title: "Performance Audit", tag: "perf" },
  { date: "2025.04", title: "Contribution Graph", tag: "feature" },
];

const TimelineWatermark: React.FC = () => {
  return (
    <div
      className="timeline-watermark pointer-events-none absolute top-24 left-8 z-0 hidden select-none md:block"
      aria-hidden="true"
    >
      <div className="mb-4 flex items-center gap-2 pl-1 text-[10px] tracking-[0.2em] text-slate-400/40 uppercase">
        <span className="h-px w-6 bg-slate-400/30" />
        <span>Timeline</span>
      </div>
      <div className="timeline-list">
        <div className="timeline-rail" />
        {MOCK_TIMELINE.map((item) => (
          <div key={item.date} className="timeline-node">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-title">{item.title}</div>
              <div className="timeline-tag">#{item.tag}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .timeline-watermark {
          opacity: 0.5;
        }
        .timeline-list {
          position: relative;
          padding-left: 18px;
        }
        .timeline-rail {
          position: absolute;
          left: 4px;
          top: 4px;
          bottom: 4px;
          width: 1px;
          background: linear-gradient(
            180deg,
            rgba(148, 163, 184, 0) 0%,
            rgba(148, 163, 184, 0.3) 12%,
            rgba(148, 163, 184, 0.3) 88%,
            rgba(148, 163, 184, 0) 100%
          );
        }
        .timeline-node {
          position: relative;
          padding-bottom: 18px;
        }
        .timeline-node:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -18px;
          top: 6px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(167, 139, 250, 0.45);
          box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.9);
        }
        .timeline-date {
          font-size: 10px;
          letter-spacing: 0.16em;
          color: rgba(148, 163, 184, 0.7);
          font-weight: 500;
        }
        .timeline-title {
          margin-top: 2px;
          font-size: 12px;
          color: rgba(203, 213, 225, 0.75);
          line-height: 1.35;
          white-space: nowrap;
          font-weight: 400;
        }
        .timeline-tag {
          margin-top: 1px;
          font-size: 9px;
          color: rgba(148, 163, 184, 0.5);
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

export default TimelineWatermark;
