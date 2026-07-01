import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SEMESTERS_META } from '../data/semestersMeta';
import { calculateSemesterGPA, calculateSemesterCredits, getGraduationClass, GRADE_POINTS } from '../utils/gpaUtils';
import { CheckCircle, Circle, HelpCircle, FileSpreadsheet, GraduationCap, ArrowRight, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CGPACalculator() {
  const { gradesHistory } = useApp();

  // Create local toggle states for semesters to let students interactively plan
  const [excludedSemesters, setExcludedSemesters] = useState<Record<string, boolean>>({});

  const toggleSemester = (id: string) => {
    setExcludedSemesters(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Perform calculations on included semesters
  let totalGradePoints = 0;
  let totalCredits = 0;
  let completedCredits = 0;

  const semesterSummaries = SEMESTERS_META.map(meta => {
    const courses = gradesHistory[meta.id] || [];
    const hasGrades = courses.some(c => c.grade !== '');
    const gpa = calculateSemesterGPA(courses);
    const { total: semTotalCredits, completed: semCompletedCredits } = calculateSemesterCredits(courses);
    const isIncluded = !excludedSemesters[meta.id] && hasGrades;

    if (isIncluded) {
      // For CGPA, we multiply valid courses' grade points by credits
      courses.forEach(course => {
        const gp = GRADE_POINTS[course.grade];
        if (gp !== undefined) {
          totalGradePoints += gp * course.credit;
          totalCredits += course.credit;
        }
        if (course.grade && course.grade !== 'I' && course.grade !== 'NG' && course.grade !== 'F') {
          completedCredits += course.credit;
        }
      });
    }

    return {
      ...meta,
      gpa,
      hasGrades,
      semTotalCredits,
      semCompletedCredits,
      isIncluded
    };
  });

  const cgpa = totalCredits === 0 ? 0.0 : Number((totalGradePoints / totalCredits).toFixed(2));
  const graduationClass = getGraduationClass(cgpa);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Intro Banner */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 p-6 shadow-sm">
        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Cumulative CGPA Optimizer
        </h2>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
          Review all semesters and plan combinations by toggling semesters on/off from the CGPA formula. 
          Use this panel to see how specific semesters affect your ultimate graduation standing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Semesters Toggle Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Interactive Semesters Timeline
            </h3>
            <span className="text-xxs text-slate-400 dark:text-slate-500 font-medium">
              Click checkboxes to include/exclude
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {semesterSummaries.map((sem) => {
              const active = sem.isIncluded;
              return (
                <div
                  key={sem.id}
                  onClick={() => sem.hasGrades && toggleSemester(sem.id)}
                  className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                    sem.hasGrades
                      ? 'cursor-pointer hover:shadow-xs'
                      : 'opacity-40 grayscale'
                  } ${
                    active
                      ? 'bg-white dark:bg-slate-950 border-blue-500 dark:border-blue-500/80'
                      : 'bg-slate-50/50 dark:bg-black/20 border-slate-100 dark:border-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                        {sem.shortName}
                      </span>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2">
                        {sem.yearName} - {sem.semesterName}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {sem.semCompletedCredits} / {sem.semTotalCredits} Credits completed
                      </p>
                    </div>

                    {sem.hasGrades ? (
                      <button
                        type="button"
                        className={`p-1 rounded-full ${
                          active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      >
                        {active ? <CheckCircle className="h-5 w-5 fill-current" /> : <Circle className="h-5 w-5" />}
                      </button>
                    ) : (
                      <span className="text-xxs font-bold text-slate-400">Empty</span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-900/40 pt-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Semester GPA
                    </span>
                    <span className={`text-lg font-black ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                      {sem.gpa.toFixed(2)}
                    </span>
                  </div>

                  {!sem.hasGrades && (
                    <Link
                      to={`/semester?sem=${sem.id}`}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 opacity-0 hover:opacity-100 transition-all text-white text-xs font-black rounded-xl"
                    >
                      Fill Semester Grades <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Math & Cumulative standing block */}
        <div className="space-y-4">
          {/* Main Standing Card */}
          <div className="rounded-2xl bg-linear-to-b from-indigo-600 to-indigo-800 p-6 text-white shadow-md">
            <div className="text-xxs font-black uppercase tracking-wider text-indigo-200">
              Active Cumulative Result
            </div>

            <div className="mt-4 text-center">
              <span className="text-5xl font-black">{cgpa.toFixed(2)}</span>
              <p className="text-xs text-indigo-200 mt-2 font-semibold">Projected CGPA</p>
            </div>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-indigo-200 font-medium">Included Credits</span>
                <span>{totalCredits} Credits</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-200 font-medium">Completed Credits</span>
                <span>{completedCredits} Credits</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-indigo-200 font-medium">Graduation standing</span>
                <span className="text-right text-emerald-300 font-black tracking-wide uppercase truncate max-w-[150px]">
                  {graduationClass}
                </span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
            >
              <Printer className="h-4 w-4" /> Print CGPA Summary
            </button>
          </div>

          {/* Mathematical breakdown card */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Formula & Math Breakdown
              </h4>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              CGPA is calculated by dividing total quality points (Grade Points × Course Credits) by the total number of credit hours attempted.
            </p>

            <div className="space-y-2.5 rounded-xl bg-slate-50 dark:bg-black/40 p-3.5 border border-slate-100 dark:border-slate-900 font-mono text-[10px] text-slate-600 dark:text-slate-400">
              <div>
                <p className="font-bold text-slate-400 mb-0.5">Quality Points Sum:</p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">
                  ∑(GP × Cr) = <span className="font-bold text-blue-600 dark:text-blue-400">{totalGradePoints.toFixed(2)}</span>
                </p>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-900 pt-2">
                <p className="font-bold text-slate-400 mb-0.5">Attempted Credits:</p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">
                  ∑(Cr) = <span className="font-bold text-blue-600 dark:text-blue-400">{totalCredits}</span>
                </p>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-900 pt-2">
                <p className="font-bold text-slate-400 mb-0.5">Division Formula:</p>
                <p className="text-slate-900 dark:text-slate-200 font-medium">
                  CGPA = {totalGradePoints.toFixed(2)} / {totalCredits} = <span className="font-bold text-blue-600 dark:text-blue-400">{cgpa.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
