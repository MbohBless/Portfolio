'use client'

export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
            animationDelay: '0s',
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
          style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(239, 68, 68, 0.3) 100%)',
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
