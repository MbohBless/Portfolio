'use client'

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Gradient Orb - Top Right */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 dark:opacity-15 blur-3xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
        style={{ filter: 'blur(80px)' }}
      />

      {/* Gradient Orb - Bottom Left */}
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-15 blur-3xl bg-gradient-to-tr from-cyan-400 via-blue-400 to-purple-400"
        style={{ filter: 'blur(80px)' }}
      />

      {/* Gradient Orb - Center Right */}
      <div
        className="absolute top-1/2 -right-20 w-80 h-80 rounded-full opacity-20 dark:opacity-10 blur-3xl bg-gradient-to-l from-indigo-400 via-violet-400 to-purple-400"
        style={{ filter: 'blur(80px)' }}
      />

      {/* Subtle Grid Lines - Horizontal */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent calc(100% - 1px), currentColor calc(100% - 1px))`,
          backgroundSize: '100% 80px',
        }}
      />

      {/* Subtle Grid Lines - Vertical */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, transparent calc(100% - 1px), currentColor calc(100% - 1px))`,
          backgroundSize: '80px 100%',
        }}
      />

      {/* Radial Gradient Center Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-15 dark:opacity-8"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
