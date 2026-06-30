import React from 'react';
import { HelpCircle, GraduationCap, Award, BookOpen, Briefcase, Star, HelpCircle as Info } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Intro Hero Portal */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 to-indigo-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 right-0 -mr-8 -mb-8 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xxs font-black uppercase tracking-wider backdrop-blur-md">
            Department Portal
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            DBU Software Engineering Department
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Welcome to the official GPA guidance tool. Located at the historic academic hub of Debre Berhan, Ethiopia, our department fosters innovators, technologists, and world-class engineers.
          </p>
        </div>
      </div>

      {/* Grid: Department info cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Academic Mission */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            Academic Excellence
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
            The Software Engineering curriculum spans 4 primary academic years (starting from Year 2 after general fresh freshman foundation). It equips scholars with discrete math, database principles, advanced algorithms, and systems engineering expertise.
          </p>
        </div>

        {/* Internship advice */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4">
            <Briefcase className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            Practical Attachment
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
            A key milestone of the program is the **Year 4 Semester II Industrial Practice (SE492)**. Students are placed in major national tech companies, research facilities, and government ministries to apply software design principles to real-world challenges.
          </p>
        </div>

        {/* Honors role */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mb-4">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            Scholarly Standing
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
            Achieving a CGPA of 3.75+ places graduates on the highly prestigious DBU President's Honor Roll, conferring the standard classification of **Very Great Distinction** which is heavily valued by graduate schools and top employers.
          </p>
        </div>
      </div>

      {/* Interactive FAQ and Guidance timeline */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">
          Academic Standing and GPA Guidance
        </h3>

        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 p-4">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500 fill-current" /> How do incomplete "I" and no-grade "NG" affect GPA?
            </h4>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
              "I" (Incomplete) and "NG" (No Grade) are placeholder grades representing pending coursework, missing final evaluations, or extreme medical cases. In accordance with DBU registrar legislation, these are excluded entirely from both the GPA quality point calculations and attempted credit denominators until resolved.
            </p>
          </div>

          <div className="rounded-xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 p-4">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-blue-500" /> What is the minimum CGPA to stay in good standing?
            </h4>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
              A cumulative CGPA of 2.00 or above is required to maintain positive academic standing. A CGPA falling below 2.00 triggers a formal academic warning from the registrar, potentially leading to academic probation if not elevated during subsequent semesters.
            </p>
          </div>

          <div className="rounded-xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 p-4">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-emerald-500" /> How do I prepare for Year 4 Semester II Internship placement?
            </h4>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
              Internship selection happens during Year 4 Semester I. Departments prioritize students with high CGPA standings (3.0+) and strong programming records (Advanced Programming, OOP, and Web Programming) for placement in premium national research centers and companies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
