import React, { useEffect, useRef, useState } from "react";

const IDLE_MS = 5000;
const BUBBLE_MS = 6000;

const Avatar: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<number | null>(null);

  const [idle, setIdle] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const hideBubble = window.setTimeout(() => setShowBubble(false), BUBBLE_MS);
    return () => window.clearTimeout(hideBubble);
  }, []);

  useEffect(() => {
    const armIdle = () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => setIdle(true), IDLE_MS);
    };

    const onMove = () => {
      setIdle(false);
      armIdle();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    armIdle();

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`avatar-root pointer-events-none fixed right-0 bottom-0 z-20 ${idle ? "is-idle" : ""}`}
      aria-hidden="true"
    >
      <div
        className={`speech-bubble pointer-events-auto absolute right-48 bottom-64 rounded-2xl border border-violet-400/30 bg-slate-900/85 px-4 py-2 text-sm whitespace-nowrap text-slate-100 shadow-xl backdrop-blur-md transition-all duration-500 md:right-35 md:bottom-67 ${
          showBubble && !idle
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        你好，我是杨亿，英文名叫: Eli Yang !
        <span className="absolute right-8 -bottom-1.5 h-3 w-3 rotate-45 border-r border-b border-violet-400/30 bg-slate-900/85" />
      </div>

      <div className="avatar-frame pointer-events-auto">
        <img src="/avatar.svg" alt="Eli" className="avatar-img" draggable={false} />
      </div>
    </div>
  );
};

export default Avatar;
