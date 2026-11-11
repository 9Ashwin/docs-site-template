import type { ReactNode } from "react";

/** Inline line icons shared by the homepage. 24×24, stroke = currentColor. */
const paths: Record<string, ReactNode> = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  external: <path d="M8 5H5v14h14v-3M12 5h7v7M10 14 19 5" />,
  github: (
    <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5v-3.5c0-1 .1-1.4-.5-2 3.4-.4 7-1.7 7-7.5a5.7 5.7 0 0 0-1.5-4 5.4 5.4 0 0 0-.1-4S18.6-.1 15.5 2a14 14 0 0 0-7 0C5.4-.1 4.1.3 4.1.3A5.4 5.4 0 0 0 4 4.3a5.7 5.7 0 0 0-1.5 4c0 5.8 3.6 7.1 7 7.5-.6.6-.6 1.2-.5 2V21" />
  ),
  workspace: (
    <>
      <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7Z" />
      <path d="M3 8.5 12 13l9-4.5M12 13v7" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8m-4-4v4M6 7h5m-5 3h3" />
    </>
  ),
  browser: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 9h20M6 6.5h.01M9 6.5h.01" />
      <path d="m11 13 6 2.5-2.6.9-.9 2.6Z" />
    </>
  ),
  memory: (
    <path d="M12 7c-1-5-7-5-7 0-4 1-4 7 0 8-1 5 5 7 7 3 2 4 8 2 7-3 4-1 4-7 0-8 0-5-6-5-7 0Zm0 0v11M5 7c0 2 2 3 3 3m11-3c0 2-2 3-3 3M5 15l3-1m11 1-3-1" />
  ),
  channels: (
    <>
      <rect x="7" y="2" width="10" height="7" rx="1" />
      <rect x="2" y="16" width="8" height="6" rx="1" />
      <rect x="14" y="16" width="8" height="6" rx="1" />
      <path d="M12 9v4m-6 3v-3h12v3" />
    </>
  ),
  model: <path d="M12 2.5 13.8 9l6.5 1.8-6.5 1.8L12 19l-1.8-6.4L3.7 10.8 10.2 9 12 2.5Z" />,
  skills: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 17.5h7m-3.5-3.5v7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6l9-4Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4M8 13h.01M16 13h.01M9 17h6" />
    </>
  ),
  layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9.5 9 5 9-5M3 17l9 5 9-5" />,
  terminal: (
    <>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="m6 8 4 4-4 4m7 0h5" />
    </>
  ),
  code: <path d="m7 7-5 5 5 5m10-10 5 5-5 5m-3-14-4 18" />,
  server: (
    <>
      <rect x="3" y="3" width="18" height="7" rx="1" />
      <rect x="3" y="14" width="18" height="7" rx="1" />
      <path d="M7 6.5h.01M7 17.5h.01M12 6.5h5m-5 11h5" />
    </>
  ),
  plug: <path d="M9 2v5m6-5v5M6 7h12v4a6 6 0 0 1-12 0V7Zm6 10v5" />,
  swap: <path d="M4 8h13l-3-3m6 11H7l3 3" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16.5 5.2a3.2 3.2 0 0 1 0 5.6M17 14.6a5 5 0 0 1 3.5 4.9" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h.5" />
    </>
  ),
  check: <path d="m5 12 4.5 4.5L19 7" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m5 5 14 14M5 19 19 5" />,
  chevron: <path d="m6 9 6 6 6-6" />,
};

export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
