import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ChevronRight, Calendar } from 'lucide-react';
import { SEMESTERS_META } from '../data/semestersMeta';
import coursesDataJson from '../data/courses.json';

const coursesData = coursesDataJson as Record<string, Array<{ code: string; name: string; credit: number }>>;

interface SearchResult {
  code: string;
  name: string;
  credit: number;
  semesterId: string;
  semesterName: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load all courses once
  const [allCourses, setAllCourses] = useState<SearchResult[]>([]);

  useEffect(() => {
    const temp: SearchResult[] = [];
    SEMESTERS_META.forEach(meta => {
      const courses = coursesData[meta.id] || [];
      courses.forEach(c => {
        temp.push({
          ...c,
          semesterId: meta.id,
          semesterName: `${meta.yearName} - ${meta.semesterName}`
        });
      });
    });
    setAllCourses(temp);
  }, []);

  // Filter on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allCourses.filter(
      c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, allCourses]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle click on course result
  const handleSelect = (res: SearchResult) => {
    onClose();
    // Navigate to semester page
    navigate(`/semester?sem=${res.semesterId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/40 dark:bg-black/60 p-4 pt-[10vh] backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-850 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type course name or code (e.g., SE201, Database)..."
            className="h-9 w-full bg-transparent text-sm text-gray-900 dark:text-white outline-hidden placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1 text-xxs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Found Courses ({results.length})
              </div>
              {results.map((res) => (
                <button
                  key={`${res.semesterId}-${res.code}`}
                  onClick={() => handleSelect(res)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-blue-50/70 dark:hover:bg-blue-950/20 transition-all group cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-400 dark:text-gray-500">
                        {res.code} • {res.credit} Credits
                      </div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {res.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="font-medium text-xxs truncate max-w-[120px]">{res.semesterName}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No matching courses found for "<span className="font-semibold">{query}</span>"
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-500">
              <p className="font-medium mb-1">Quick Suggestions:</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {['Database', 'Security', 'Web', 'Artificial Intelligence', 'Networking'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 px-2.5 py-1 text-xxs font-medium text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
