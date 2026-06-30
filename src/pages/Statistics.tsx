import React from 'react';
import { useApp } from '../context/AppContext';
import { SEMESTERS_META } from '../data/semestersMeta';
import { calculateSemesterGPA, calculateSemesterCredits, GRADE_POINTS } from '../utils/gpaUtils';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { BarChart3, LineChart as LucideLineChart, PieChart, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Statistics() {
  const { gradesHistory } = useApp();

  // 1. Compile chronological statistics
  let runningPoints = 0;
  let runningCredits = 0;

  const data = SEMESTERS_META.map(meta => {
    const courses = gradesHistory[meta.id] || [];
    const hasGrades = courses.some(c => c.grade !== '');
    const gpa = hasGrades ? calculateSemesterGPA(courses) : 0;
    const { total: totalCredits, completed: completedCredits } = calculateSemesterCredits(courses);

    // Compute running CGPA for the growth chart
    if (hasGrades) {
      courses.forEach(course => {
        const pts = GRADE_POINTS[course.grade];
        if (pts !== undefined) {
          runningPoints += pts * course.credit;
          runningCredits += course.credit;
        }
      });
    }

    const currentRunningCGPA = runningCredits > 0 ? Number((runningPoints / runningCredits).toFixed(2)) : 0;

    return {
      name: meta.shortName,
      fullName: `${meta.yearName} ${meta.semesterName}`,
      gpa: hasGrades ? gpa : null,
      cgpa: runningCredits > 0 ? currentRunningCGPA : null,
      attempted: totalCredits,
      completed: completedCredits,
    };
  }).filter(d => d.gpa !== null || d.attempted > 0);

  // 2. Compute Grade Distribution counts
  const gradeCounts: Record<string, number> = {
    'A/A-': 0,
    'B+/B/B-': 0,
    'C+/C/C-': 0,
    'D/F': 0,
    'Other (I/NG)': 0
  };

  SEMESTERS_META.forEach(meta => {
    const courses = gradesHistory[meta.id] || [];
    courses.forEach(c => {
      if (c.grade) {
        if (['A', 'A-'].includes(c.grade)) gradeCounts['A/A-']++;
        else if (['B+', 'B', 'B-'].includes(c.grade)) gradeCounts['B+/B/B-']++;
        else if (['C+', 'C', 'C-'].includes(c.grade)) gradeCounts['C+/C/C-']++;
        else if (['D', 'F'].includes(c.grade)) gradeCounts['D/F']++;
        else gradeCounts['Other (I/NG)']++;
      }
    });
  });

  const gradeDistributionData = Object.keys(gradeCounts).map(key => ({
    gradeGroup: key,
    count: gradeCounts[key]
  }));

  const hasGradesEntered = data.some(d => d.gpa !== null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Intro Header */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
            Academic Performance Analytics
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Unlock in-depth charts mapping your academic achievements, including Grade Distribution histograms, credit completion rates, and comparative lines of your semester GPA against cumulative CGPA trends.
        </p>
      </div>

      {!hasGradesEntered ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-16 text-center text-gray-400 dark:text-gray-500">
          <TrendingUp className="h-12 w-12 stroke-1 mx-auto text-gray-300 dark:text-gray-750 mb-3" />
          <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-200">No Grades Analyzable</h3>
          <p className="text-xs max-w-xs mx-auto mt-1 leading-relaxed">
            Charts and distributions will appear automatically once you input at least one course grade into any semester calculator.
          </p>
          <Link
            to="/semester"
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Enter Grades
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chart 1: GPA vs CGPA comparison */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
            <div className="mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                GPA vs CGPA Growth Curves
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                Compare individual semester GPAs against cumulative CGPA growth
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 4]} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      borderRadius: '0.75rem',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="cgpa"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCgpa)"
                    name="Cumulative CGPA"
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#818CF8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Semester GPA"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Grade Distribution Histogram */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
            <div className="mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Grade Category Distribution
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                Frequency analysis of your earned grade buckets
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" className="hidden dark:block" />
                  <XAxis dataKey="gradeGroup" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      borderRadius: '0.75rem',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Occurrences" maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Credit Completion Tracking */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Credit Hours Fulfilled vs Attempted
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                Compare completed vs total credit hours per semester chronologically
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      borderRadius: '0.75rem',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="completed" fill="#10B981" name="Completed Credits" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attempted" fill="#E5E7EB" name="Total Credit Requirements" radius={[4, 4, 0, 0]} className="dark:fill-gray-800" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
