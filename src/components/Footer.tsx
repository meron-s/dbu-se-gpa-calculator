import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 dark:border-gray-800/60 bg-white dark:bg-gray-900 py-6 px-6 text-center text-xs text-gray-500 dark:text-gray-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div>
          © {new Date().getFullYear()} Debre Berhan University. Software Engineering Department.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="h-3 w-3 text-red-500 fill-current animate-pulse" />
          <span>for DBU SE Scholars</span>
        </div>
      </div>
    </footer>
  );
}
