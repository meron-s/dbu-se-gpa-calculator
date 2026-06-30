import React from 'react';
import { useApp } from '../context/AppContext';
import { SEMESTERS_META } from '../data/semestersMeta';
import { calculateCGPA } from '../utils/gpaUtils';
import { CheckCircle2, Circle, AlertCircle, Award, Printer, GraduationCap } from 'lucide-react';

export default function AcademicProgress() {
  const { gradesHistory } = useApp();
  const { cgpa, completedCredits, totalCredits } = calculateCGPA(gradesHistory);

  // Total standard department credits (sum of all standard courses in courses.json)
  const REQUIRED_TOTAL_CREDITS = 121;
  const remainingCredits = Math.max(0, REQUIRED_TOTAL_CREDITS - completedCredits);
  const completionPercentage = Math.round((completedCredits / REQUIRED_TOTAL_CREDITS) * 100);

  // Classification targets
  const classes = [
    { name: 'Very Great Distinction (Excellent)', min: '3.75', max: '4.00', bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100' },
    { name: 'Great Distinction (Very Good)', min: '3.50', max: '3.74', bg: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-100' },
    { name: 'Distinction (Good)', min: '3.00', max: '3.49', bg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100' },
    { name: 'Pass', min: '2.00', max: '2.99', bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Page intro banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
            Academic Degree Milestones
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track your journey towards graduation. The standard curriculum for the DBU Software Engineering program requires 121 Credit Hours.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer transition-all self-start sm:self-center"
        >
          <Printer className="h-4 w-4" /> Export Progress Report
        </button>
      </div>

      {/* Progress KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Progress Bar Card */}
        <div className="sm:col-span-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Curriculum Completion Progress
            </span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              {completionPercentage}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3.5 mb-6 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-3.5 rounded-full transition-all duration-700 relative"
              style={{ width: `${completionPercentage}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <p className="text-gray-400">Completed Credits</p>
              <p className="text-2xl font-black text-gray-800 dark:text-gray-200 mt-1">
                {completedCredits} <span className="text-xs font-normal text-gray-400">Credits</span>
              </p>
            </div>
            <div>
              <p className="text-gray-400">Remaining Credits</p>
              <p className="text-2xl font-black text-gray-800 dark:text-gray-200 mt-1">
                {remainingCredits} <span className="text-xs font-normal text-gray-400">Credits</span>
              </p>
            </div>
          </div>
        </div>

        {/* Graduation Class stood */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-4">
            Graduation Standing
          </span>
          <div className="text-center py-2">
            <GraduationCap className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto stroke-1" />
            <h4 className="text-sm font-black text-gray-800 dark:text-gray-200 mt-2 truncate">
              {cgpa.toFixed(2)} CGPA
            </h4>
            <p className="text-xxs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/10 inline-block max-w-full truncate">
              {cgpa >= 2.0 ? 'Passing Standing' : 'Academic Warning'}
            </p>
          </div>
        </div>
      </div>

      {/* Graduation requirements breakdown & Detailed Course Status Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Class boundaries list */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Graduation Standings guide
            </h3>
            <p className="text-xxs text-gray-400 dark:text-gray-500">
              Department threshold class boundaries
            </p>
          </div>

          <div className="space-y-2.5">
            {classes.map((cls) => {
              const matches =
                cgpa >= Number(cls.min) && (cls.max === '4.00' ? cgpa <= 4.0 : cgpa < Number(cls.max));
              return (
                <div
                  key={cls.name}
                  className={`rounded-xl border p-3 flex justify-between items-center transition-all ${
                    matches
                      ? `${cls.bg} border-l-4 scale-102 font-bold`
                      : 'border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-950/20 opacity-60 text-gray-500'
                  }`}
                >
                  <div>
                    <p className="text-xs font-black">{cls.name}</p>
                    <p className="text-xxs mt-0.5">CGPA: {cls.min} - {cls.max}</p>
                  </div>
                  {matches && <Award className="h-4 w-4 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline courses checked */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Curriculum Audit Timeline
            </h3>
            <p className="text-xxs text-gray-400 dark:text-gray-500">
              Chronological review of completed and remaining courses
            </p>
          </div>

          <div className="space-y-6">
            {SEMESTERS_META.map((meta) => {
              const courses = gradesHistory[meta.id] || [];
              const passedCount = courses.filter(
                (c) => c.grade && c.grade !== 'I' && c.grade !== 'NG' && c.grade !== 'F'
              ).length;
              const hasGrades = courses.some(c => c.grade !== '');

              return (
                <div key={meta.id} className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800 last:border-0 pb-2">
                  {/* Timeline point indicator */}
                  <span className={`absolute -left-2 top-0 flex h-4 w-4 items-center justify-center rounded-full border bg-white dark:bg-gray-900 ${
                    passedCount === courses.length && courses.length > 0
                      ? 'border-emerald-500 text-emerald-500'
                      : hasGrades
                      ? 'border-blue-500 text-blue-500'
                      : 'border-gray-200 dark:border-gray-800 text-gray-300'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  </span>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-black text-gray-800 dark:text-gray-200">
                        {meta.yearName} - {meta.semesterName} ({meta.shortName})
                      </h4>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {passedCount} / {courses.length} Courses Passed
                      </p>
                    </div>
                  </div>

                  {/* Horizontal mini badges for courses */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {courses.map((course) => {
                      const grade = course.grade;
                      const isPassed = grade && grade !== 'I' && grade !== 'NG' && grade !== 'F';
                      const isFailed = grade === 'F';
                      const isSpecial = grade === 'I' || grade === 'NG';

                      return (
                        <div
                          key={course.code}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold border transition-all ${
                            isPassed
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                              : isFailed
                              ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                              : isSpecial
                              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40'
                              : 'bg-gray-50 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800'
                          }`}
                          title={`${course.name} (${course.credit} Credits)${grade ? ` - Grade: ${grade}` : ''}`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : isFailed || isSpecial ? (
                            <AlertCircle className="h-3 w-3" />
                          ) : (
                            <Circle className="h-2.5 w-2.5 text-gray-300 dark:text-gray-700" />
                          )}
                          <span>{course.code}</span>
                          {grade && (
                            <span className="font-black border-l border-current/20 pl-1 ml-1">{grade}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
