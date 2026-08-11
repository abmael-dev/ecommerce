import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'

export const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      aria-label="Alternar tema claro/escuro"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
      </motion.div>
    </button>
  )
}
