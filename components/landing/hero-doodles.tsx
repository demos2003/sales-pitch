"use client"

const doodleClass = "text-primary/40"
const baseSize = 2.4

export function HeroDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Slideshow / deck – top left */}
      <div
        className="absolute left-[6%] top-[10%] cursor-default"
        style={{ transform: "rotate(-6deg)", animation: "doodle-float 4s ease-in-out infinite" }}
      >
        <div className="doodle-item opacity-90 hover:opacity-100">
        <svg
          width={32 * baseSize}
          height={28 * baseSize}
          viewBox="0 0 32 28"
          fill="none"
          className={doodleClass}
        >
          <rect x="2" y="2" width="20" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity={0.12} />
          <rect x="5" y="5" width="6" height="1" rx="0.5" fill="currentColor" fillOpacity={0.5} />
          <rect x="5" y="8" width="10" height="1" rx="0.5" fill="currentColor" fillOpacity={0.35} />
          <rect x="5" y="11" width="8" height="1" rx="0.5" fill="currentColor" fillOpacity={0.35} />
          <rect x="24" y="4" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity={0.08} />
          <rect x="26" y="8" width="2" height="2" rx="0.5" fill="currentColor" fillOpacity={0.4} />
        </svg>
        </div>
      </div>

      {/* Cursor / pointer – top right */}
      <div
        className="absolute right-[10%] top-[14%] cursor-default"
        style={{ transform: "rotate(12deg)", animation: "doodle-wiggle 3s ease-in-out infinite" }}
      >
        <div className="doodle-item opacity-90 hover:opacity-100">
        <svg
          width={22 * baseSize}
          height={22 * baseSize}
          viewBox="0 0 24 24"
          fill="none"
          className={doodleClass}
        >
          <path
            d="M5 4l7 7-2 4 3-1 6-10-10 6-1 3 4-2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity={0.15}
          />
        </svg>
        </div>
      </div>

      {/* Microphone – left mid */}
      <div
        className="absolute left-[3%] top-[38%] cursor-default"
        style={{ transform: "rotate(-8deg)", animation: "doodle-float 5s ease-in-out infinite 0.5s" }}
      >
        <div className="doodle-item opacity-90 hover:opacity-100">
        <svg
          width={20 * baseSize}
          height={28 * baseSize}
          viewBox="0 0 20 28"
          fill="none"
          className={doodleClass}
        >
          <rect x="6" y="2" width="8" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity={0.1} />
          <path d="M4 14v2a6 6 0 0012 0v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 22v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 26h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        </div>
      </div>

      {/* Lightbulb – right side */}
      <div
        className="absolute right-[4%] top-[44%] cursor-default"
        style={{ transform: "rotate(6deg)", animation: "doodle-pulse 2.5s ease-in-out infinite" }}
      >
        <div className="doodle-item opacity-90 hover:opacity-100">
        <svg
          width={22 * baseSize}
          height={28 * baseSize}
          viewBox="0 0 22 28"
          fill="none"
          className={doodleClass}
        >
          <path
            d="M11 2a6 6 0 014 10.5v4.5h-2v2h4v-8.5a6 6 0 10-4 0V19h4v-2h-2v-4.5A6 6 0 0111 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity={0.12}
          />
          <path d="M9 24h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        </div>
      </div>

      {/* Rising arrow / chart – bottom left */}
      <div
        className="absolute bottom-[20%] left-[8%] cursor-default"
        style={{ transform: "rotate(-4deg)", animation: "doodle-float 4.5s ease-in-out infinite 1s" }}
      >
        <div className="doodle-item opacity-90 hover:opacity-100">
        <svg
          width={36 * baseSize}
          height={28 * baseSize}
          viewBox="0 0 36 28"
          fill="none"
          className={doodleClass}
        >
          <path d="M4 20V10l6 4 6-8 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 10v12M28 10h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        </div>
      </div>

      {/* Code brackets </> – bottom right */}
      <div
        className="absolute bottom-[26%] right-[8%] font-mono font-semibold cursor-default"
        style={{ transform: "rotate(5deg)", animation: "doodle-wiggle 3.5s ease-in-out infinite 0.3s", fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)" }}
      >
        <div className={`doodle-item opacity-90 hover:opacity-100 ${doodleClass}`}>
        &lt;/&gt;
        </div>
      </div>

      {/* Rocket – bottom center-left */}
      <div
        className="absolute bottom-[14%] left-[18%] cursor-default"
        style={{ transform: "rotate(8deg)", animation: "doodle-float 4s ease-in-out infinite 0.7s" }}
      >
        <div className="doodle-item opacity-90 hover:opacity-100">
        <svg
          width={20 * baseSize}
          height={28 * baseSize}
          viewBox="0 0 20 28"
          fill="none"
          className={doodleClass}
        >
          <path
            d="M10 2l-2 8H4l4 4-2 8 6-6 6 6-2-8 4-4h-4l-2-8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity={0.1}
          />
          <path d="M10 14v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        </div>
      </div>
    </div>
  )
}
