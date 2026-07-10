"use client";

import { useRef, useState } from "react";

export default function CryButton({
  url,
  label,
}: {
  url: string;
  label: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (playing) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = 0.4;
      audioRef.current.onended = () => setPlaying(false);
      audioRef.current.onerror = () => setPlaying(false);
    }

    setPlaying(true);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => setPlaying(false));
  };

  return (
    <button
      type="button"
      onClick={play}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white ${
        playing ? "animate-pulse text-red-500 dark:text-red-400" : ""
      }`}
    >
      <svg
        className="h-4.5 w-4.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
        />
      </svg>
    </button>
  );
}
