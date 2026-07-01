import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateCGPA } from '../utils/gpaUtils';
import { Sun, Moon, Undo2, Award, GraduationCap } from 'lucide-react';

export default function Navbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { theme, toggleTheme, undo, canUndo, gradesHistory } = useApp();
  const { cgpa } = calculateCGPA(gradesHistory);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-900/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-6 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 text-white shadow-xs font-black text-sm">
          DB
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-wider text-slate-950 dark:text-white leading-none">
            DBU Software
          </h1>
          <p className="hidden text-[10px] opacity-70 text-slate-500 dark:text-slate-400 sm:block leading-tight">
            Engineering Department
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Undo Action */}
        {canUndo && (
          <button
            onClick={undo}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
            title="Undo last change (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>
        )}

        {/* Search Shortcut Button */}
        <button
          onClick={onOpenSearch}
          className="flex h-9 items-center gap-2 rounded-full border border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-800/50 px-4 text-left text-xs text-slate-400 dark:text-slate-500 hover:border-blue-400 transition-all cursor-pointer w-44 sm:w-64"
        >
          <span className="hidden sm:inline text-slate-400">Search courses...</span>
          <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 ml-auto">
            ⌘K
          </span>
        </button>

        {/* CGPA quick status card */}
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 border border-blue-100 dark:border-blue-900/30">
          <span className="text-xxs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            CGPA
          </span>
          <span className="text-sm font-black text-blue-700 dark:text-blue-300">
            {cgpa.toFixed(2)}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer shadow-xs transition-all"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
