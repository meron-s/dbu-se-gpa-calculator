import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mb-6 border border-rose-100 dark:border-rose-900/40">
        <ShieldAlert className="h-8 w-8 stroke-1" />
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">
        Route Not Found (404)
      </h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-2 leading-relaxed">
        The page you are looking for does not exist or may have been relocated under a different academic catalog path.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 text-xs font-bold shadow-md shadow-blue-600/10 transition-all cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
    </div>
  );
}
