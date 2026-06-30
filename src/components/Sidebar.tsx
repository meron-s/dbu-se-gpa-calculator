import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  TrendingUp,
  Award,
  BookOpen,
  Settings,
  HelpCircle,
  GraduationCap,
  LineChart
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Semester GPA', path: '/semester', icon: Calculator },
  { name: 'CGPA Calculator', path: '/cgpa', icon: BookOpen },
  { name: 'Academic Progress', path: '/progress', icon: GraduationCap },
  { name: 'GPA Prediction', path: '/prediction', icon: Award },
  { name: 'Statistics', path: '/statistics', icon: LineChart },
  { name: 'About Department', path: '/about', icon: HelpCircle },
  { name: 'Settings', path: '/settings', icon: Settings }
];

export default function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar (Left side rail) */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-blue-950 dark:bg-slate-900 text-white flex md:flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="px-3 py-2 text-[10px] font-black tracking-widest text-blue-200/50 dark:text-slate-500 uppercase">
            Menu Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white/10 text-white border-l-4 border-blue-400'
                        : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Info label at bottom */}
        <div className="rounded-xl bg-blue-900/40 dark:bg-slate-850/60 p-3 text-center border border-blue-800/30 dark:border-slate-800/40">
          <div className="text-[10px] font-black tracking-wider uppercase text-blue-300 dark:text-blue-400 mb-0.5">
            Debre Berhan University
          </div>
          <p className="text-[9px] text-blue-200/50 dark:text-slate-500 font-mono">
            SE Dept Calculator v1.0
          </p>
        </div>
      </aside>

      {/* Mobile Navigation (Bottom bar) */}
      <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 md:hidden">
        {navItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-lg py-1 px-2.5 transition-all ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] font-medium tracking-tight">
                {item.name.split(' ')[0]}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
