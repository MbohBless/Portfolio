'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    )
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
        title="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
        title="Dark mode"
      >
        🌙
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
        title="System preference"
      >
        💻
      </button>
    </div>
  )
}
