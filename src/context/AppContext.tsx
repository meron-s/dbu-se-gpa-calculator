import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GPAHistory, StudentCourseGrade, Badge } from '../types';
import { loadFromLocalStorage, saveToLocalStorage, calculateSemesterGPA, calculateCGPA } from '../utils/gpaUtils';
import { SEMESTERS_META } from '../data/semestersMeta';
import coursesDataJson from '../data/courses.json';

const coursesData = coursesDataJson as Record<string, Array<{ code: string; name: string; credit: number }>>;

interface AppContextType {
  gradesHistory: GPAHistory;
  theme: 'light' | 'dark';
  selectedYear: string;
  selectedSemester: string;
  undoStack: GPAHistory[];
  badges: Badge[];
  setSelectedYear: (year: string) => void;
  setSelectedSemester: (sem: string) => void;
  saveSemesterGrades: (semesterId: string, courses: StudentCourseGrade[]) => void;
  deleteSemesterGrades: (semesterId: string) => void;
  addCustomCourse: (semesterId: string, course: { code: string; name: string; credit: number; grade: string }) => void;
  editCourse: (semesterId: string, code: string, updated: Partial<StudentCourseGrade>) => void;
  deleteCourse: (semesterId: string, code: string) => void;
  resetAllData: () => void;
  undo: () => void;
  canUndo: boolean;
  toggleTheme: () => void;
  importBackup: (backup: string) => boolean;
  exportBackup: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dbu_se_gpa_history';
const THEME_KEY = 'dbu_se_gpa_theme';

export function AppProvider({ children }: { children: ReactNode }) {
  // Load initial state from local storage or pre-populate with default courses
  const getInitialHistory = (): GPAHistory => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let history: GPAHistory = {};
    let loadedFromSaved = false;

    if (saved) {
      try {
        history = JSON.parse(saved);
        loadedFromSaved = true;
      } catch (e) {
        console.error('Failed to parse saved grades history', e);
      }
    }

    // Ensure all semesters are initialized and default courses' credits match latest requirements.
    SEMESTERS_META.forEach(meta => {
      const defaultCourses = coursesData[meta.id] || [];
      const savedCourses = history[meta.id] || [];
      
      if (!loadedFromSaved || savedCourses.length === 0) {
        // No saved courses or failed load, use latest defaults
        history[meta.id] = defaultCourses.map(c => ({
          ...c,
          grade: ''
        }));
      } else {
        // We have saved courses. Let's make sure default courses' credits match our latest defaults (5 credits except 3 for inclusiveness/global)
        const updatedCourses: StudentCourseGrade[] = [];
        
        savedCourses.forEach(sc => {
          const defaultC = defaultCourses.find(dc => dc.code === sc.code);
          if (defaultC) {
            // Update credit to matching default
            updatedCourses.push({
              ...sc,
              credit: defaultC.credit
            });
          } else {
            // Keep custom courses as is
            updatedCourses.push(sc);
          }
        });
        
        // Also add any default courses that might be missing
        defaultCourses.forEach(dc => {
          if (!updatedCourses.some(mc => mc.code === dc.code)) {
            updatedCourses.push({
              ...dc,
              grade: ''
            });
          }
        });
        
        history[meta.id] = updatedCourses;
      }
    });

    return history;
  };

  const [gradesHistory, setGradesHistory] = useState<GPAHistory>(getInitialHistory);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadFromLocalStorage<'light' | 'dark'>(THEME_KEY, 'light'));
  const [selectedYear, setSelectedYear] = useState<string>('Year 2');
  const [selectedSemester, setSelectedSemester] = useState<string>('Semester I');
  const [undoStack, setUndoStack] = useState<GPAHistory[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Push to undo stack
  const pushToUndo = (historyToPush: GPAHistory) => {
    setUndoStack(prev => {
      const next = [...prev, JSON.parse(JSON.stringify(historyToPush))];
      if (next.length > 10) next.shift(); // Max 10 items
      return next;
    });
  };

  // Auto-save and sync to body class for styling
  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEY, gradesHistory);
    calculateBadges();
  }, [gradesHistory]);

  useEffect(() => {
    saveToLocalStorage(THEME_KEY, theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toggle Dark Mode
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Save grades for a semester
  const saveSemesterGrades = (semesterId: string, courses: StudentCourseGrade[]) => {
    pushToUndo(gradesHistory);
    setGradesHistory(prev => ({
      ...prev,
      [semesterId]: courses
    }));
  };

  // Delete grades for a semester (resets grades of all current courses to empty without deleting custom/edited ones)
  const deleteSemesterGrades = (semesterId: string) => {
    pushToUndo(gradesHistory);
    setGradesHistory(prev => {
      const currentCourses = prev[semesterId] || [];
      if (currentCourses.length === 0) {
        const defaultCourses = coursesData[semesterId] || [];
        return {
          ...prev,
          [semesterId]: defaultCourses.map(c => ({ ...c, grade: '' }))
        };
      }
      return {
        ...prev,
        [semesterId]: currentCourses.map(c => ({ ...c, grade: '' }))
      };
    });
  };

  // Add custom course to a semester
  const addCustomCourse = (semesterId: string, course: { code: string; name: string; credit: number; grade: string }) => {
    pushToUndo(gradesHistory);
    setGradesHistory(prev => {
      const current = prev[semesterId] || [];
      // Prevent duplicates
      if (current.some(c => c.code === course.code)) return prev;
      return {
        ...prev,
        [semesterId]: [...current, course]
      };
    });
  };

  // Edit individual course
  const editCourse = (semesterId: string, code: string, updated: Partial<StudentCourseGrade>) => {
    pushToUndo(gradesHistory);
    setGradesHistory(prev => {
      const current = prev[semesterId] || [];
      return {
        ...prev,
        [semesterId]: current.map(c => (c.code === code ? { ...c, ...updated } : c))
      };
    });
  };

  // Delete individual course from semester
  const deleteCourse = (semesterId: string, code: string) => {
    pushToUndo(gradesHistory);
    setGradesHistory(prev => {
      const current = prev[semesterId] || [];
      return {
        ...prev,
        [semesterId]: current.filter(c => c.code !== code)
      };
    });
  };

  // Reset everything
  const resetAllData = () => {
    pushToUndo(gradesHistory);
    const initial: GPAHistory = {};
    SEMESTERS_META.forEach(meta => {
      const defaultCourses = coursesData[meta.id] || [];
      initial[meta.id] = defaultCourses.map(c => ({
        ...c,
        grade: ''
      }));
    });
    setGradesHistory(initial);
  };

  // Undo last change
  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setGradesHistory(previous);
  };

  const canUndo = undoStack.length > 0;

  // Export JSON backup
  const exportBackup = (): string => {
    return JSON.stringify({
      version: '1.0',
      gradesHistory,
      theme,
      exportedAt: new Date().toISOString()
    });
  };

  // Import JSON backup
  const importBackup = (backupStr: string): boolean => {
    try {
      const parsed = JSON.parse(backupStr);
      if (parsed && parsed.gradesHistory) {
        pushToUndo(gradesHistory);
        setGradesHistory(parsed.gradesHistory);
        if (parsed.theme) setTheme(parsed.theme);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import backup data', e);
      return false;
    }
  };

  // Badge calculations
  const calculateBadges = () => {
    const list: Badge[] = [
      {
        id: 'academic_titan',
        title: 'Academic Titan',
        description: 'Earn a perfect 4.0 GPA in any semester',
        iconName: 'Award',
        unlocked: false,
        colorClass: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900'
      },
      {
        id: 'deans_list',
        title: "Dean's List Club",
        description: 'Achieve a Semester GPA of 3.75 or above',
        iconName: 'Star',
        unlocked: false,
        colorClass: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900'
      },
      {
        id: 'first_step',
        title: 'First Step',
        description: 'Store grades for your first semester',
        iconName: 'CheckCircle',
        unlocked: false,
        colorClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
      },
      {
        id: 'scholarly_momentum',
        title: 'Scholarly Momentum',
        description: 'Store grades for at least 4 semesters',
        iconName: 'Zap',
        unlocked: false,
        colorClass: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900'
      },
      {
        id: 'graduate_ready',
        title: 'Graduate Ready',
        description: 'Complete Year 5 Semester II courses with grades',
        iconName: 'GraduationCap',
        unlocked: false,
        colorClass: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900'
      },
      {
        id: 'db_master',
        title: 'Database Titan',
        description: 'Pass Fundamentals of Database Systems with an A',
        iconName: 'Database',
        unlocked: false,
        colorClass: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900'
      },
      {
        id: 'discrete_hero',
        title: 'Discrete Overcomer',
        description: 'Pass Discrete Mathematics and Combinatory with a B or above',
        iconName: 'Infinity',
        unlocked: false,
        colorClass: 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900'
      },
      {
        id: 'ai_explorer',
        title: 'AI Architect',
        description: 'Achieve an A- or A in Fundamentals of Artificial Intelligence',
        iconName: 'Cpu',
        unlocked: false,
        colorClass: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900'
      }
    ];

    let hasGradesEnteredCount = 0;
    let perfectSemester = false;
    let highSemester = false;
    let dbMastered = false;
    let discreteMastered = false;
    let aiMastered = false;
    let y5s2Completed = false;

    SEMESTERS_META.forEach(meta => {
      const courses = gradesHistory[meta.id] || [];
      const hasGrades = courses.some(c => c.grade !== '');
      if (hasGrades) {
        hasGradesEnteredCount++;
        const gpa = calculateSemesterGPA(courses);
        if (gpa === 4.0) perfectSemester = true;
        if (gpa >= 3.75) highSemester = true;

        // Check specific courses
        courses.forEach(c => {
          if (c.code === 'SE221' && (c.grade === 'A' || c.grade === 'A-')) dbMastered = true;
          if (c.code === 'SE211' && ['A', 'A-', 'B+', 'B'].includes(c.grade)) discreteMastered = true;
          if (c.code === 'SE362' && (c.grade === 'A' || c.grade === 'A-')) aiMastered = true;
        });

        if (meta.id === 'year5Semester2' && courses.every(c => c.grade !== '')) {
          y5s2Completed = true;
        }
      }
    });

    list[0].unlocked = perfectSemester;
    list[1].unlocked = highSemester;
    list[2].unlocked = hasGradesEnteredCount >= 1;
    list[3].unlocked = hasGradesEnteredCount >= 4;
    list[4].unlocked = y5s2Completed;
    list[5].unlocked = dbMastered;
    list[6].unlocked = discreteMastered;
    list[7].unlocked = aiMastered;

    setBadges(list);
  };

  return (
    <AppContext.Provider
      value={{
        gradesHistory,
        theme,
        selectedYear,
        selectedSemester,
        undoStack,
        badges,
        setSelectedYear,
        setSelectedSemester,
        saveSemesterGrades,
        deleteSemesterGrades,
        addCustomCourse,
        editCourse,
        deleteCourse,
        resetAllData,
        undo,
        canUndo,
        toggleTheme,
        importBackup,
        exportBackup
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
