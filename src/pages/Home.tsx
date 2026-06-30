import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateCGPA, calculateSemesterGPA, getGraduationClass } from '../utils/gpaUtils';
import { SEMESTERS_META } from '../data/semestersMeta';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, BookOpen, CheckCircle, GraduationCap, ArrowRight, Star, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { gradesHistory, badges } = useApp();
  const { cgpa, totalCredits, completedCredits } = calculateCGPA(gradesHistory);
  const gradClass = getGraduationClass(cgpa);

  // Parse GPA trend data for the chart
  const chartData = SEMESTERS_META.map(meta => {
    const courses = gradesHistory[meta.id] || [];
    const hasGrades = courses.some(c => c.grade !== '');
    const gpa = hasGrades ? calculateSemesterGPA(courses) : null;
    return {
      name: meta.shortName,
      gpa: gpa,
    };
  }).filter(d => d.gpa !== null);

  // Completed Semesters
  const completedSemestersCount = SEMESTERS_META.filter(meta => {
    const courses = gradesHistory[meta.id] || [];
    return courses.length > 0 && courses.every(c => c.grade !== '');
  }).length;

  // Recent grades entered
  const recentGrades: Array<{ courseCode: string; courseName: string; grade: string; semester: string }> = [];
  SEMESTERS_META.forEach(meta => {
    const courses = gradesHistory[meta.id] || [];
    courses.forEach(c => {
      if (c.grade) {
        recentGrades.push({
          courseCode: c.code,
          courseName: c.name,
          grade: c.grade,
          semester: meta.shortName
        });
      }
    });
  });

  const latestGrades = recentGrades.slice(-4).reverse();
  const unlockedBadges = badges.filter(b => b.unlocked);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 to-indigo-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 right-0 -mr-8 -mb-8 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
        
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-xxs font-bold uppercase tracking-wider backdrop-blur-md">
            Debre Berhan University • SE Portal
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            Academic Performance Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Track your semester grades, plan future course targets, and view your cumulative GPA progress automatically in accordance with the Software Engineering curriculum.
          </p>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CGPA Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Current CGPA
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {cgpa.toFixed(2)}
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-black tracking-wide text-emerald-600 dark:text-emerald-400 uppercase truncate">
                {gradClass}
              </span>
            </div>
          </div>
        </div>

        {/* Credit Hours Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Credits
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {completedCredits} <span className="text-xs font-semibold text-slate-400">/ {totalCredits} Cr</span>
            </span>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
              <div 
                className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${totalCredits > 0 ? (completedCredits / totalCredits) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Courses Completed Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completed Courses
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {completedSemestersCount} <span className="text-xs font-semibold text-slate-400">Semesters</span>
            </span>
            <p className="mt-1 text-[9px] text-slate-400 dark:text-slate-500">
              {recentGrades.filter(g => g.grade !== '' && g.grade !== 'F').length} Courses Passed
            </p>
          </div>
        </div>

        {/* Achievement Badges Count */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Graduation Class
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-800 dark:text-white truncate block">
              {cgpa >= 3.75 ? 'Very Great Distinction' : cgpa >= 3.5 ? 'Great Distinction' : cgpa >= 3.0 ? 'Distinction' : cgpa >= 2.0 ? 'Satisfactory' : 'Unsatisfactory'}
            </span>
            <p className="mt-1 text-[9px] text-slate-400 dark:text-slate-500">
              {unlockedBadges.length} / {badges.length} badges unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Charts and Lists Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recharts GPA Trend Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                GPA Trend Growth
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Chronological semester progress comparison
              </p>
            </div>
            <TrendingUp className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight="650" tickLine={false} />
                  <YAxis domain={[0, 4]} stroke="#94A3B8" fontSize={10} fontWeight="650" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '0.75rem',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      border: '1px solid #334155',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#60A5FA' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#2563EB"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    dot={{ r: 4, strokeWidth: 2 }}
                    name="Semester GPA"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
                <TrendingUp className="h-8 w-8 stroke-1 mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-xs">No grades stored yet.</p>
                <Link
                  to="/semester"
                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Enter grades to view trend chart
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Grades Panel */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Grades
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Last four grade entries logged
            </p>
          </div>

          <div className="space-y-3">
            {latestGrades.length > 0 ? (
              latestGrades.map((g, index) => (
                <div
                  key={`${g.courseCode}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/10 p-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/20"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400">
                      {g.courseCode} <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">({g.semester})</span>
                    </p>
                    <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                      {g.courseName}
                    </p>
                  </div>
                  <div className="rounded-md bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 text-xs font-black text-blue-700 dark:text-blue-300">
                    {g.grade}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-48 flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
                <BookOpen className="h-8 w-8 stroke-1 mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-xs">No grades entered yet.</p>
                <Link
                  to="/semester"
                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Get Started <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges Accomplishments Grid */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Academic Achievements
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Unlocked milestones representing your performance highlights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                  badge.unlocked
                    ? `${badge.colorClass} shadow-sm`
                    : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850 opacity-40 grayscale'
                }`}
              >
                <div className="rounded-lg p-2 bg-white dark:bg-slate-900 shadow-xs shrink-0">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-black">{badge.title}</h4>
                  <p className="text-[10px] leading-tight font-medium mt-1 text-slate-500 dark:text-slate-400">
                    {badge.description}
                  </p>
                  {badge.unlocked && (
                    <span className="mt-2 inline-flex items-center gap-0.5 rounded-full bg-white/60 dark:bg-black/20 px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-2 w-2" /> Unlocked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
