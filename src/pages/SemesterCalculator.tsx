import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SEMESTERS_META } from '../data/semestersMeta';
import { calculateSemesterGPA, calculateSemesterCredits, GRADE_POINTS } from '../utils/gpaUtils';
import { StudentCourseGrade } from '../types';
import { Plus, Trash2, RotateCcw, Save, Printer, Edit2, Check, X, FileText } from 'lucide-react';

export default function SemesterCalculator() {
  const {
    gradesHistory,
    saveSemesterGrades,
    addCustomCourse,
    editCourse,
    deleteCourse,
    deleteSemesterGrades,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  // Find semester from URL or default to Year 2 Semester 1
  const initialSemesterId = searchParams.get('sem') || 'year2Semester1';
  const [activeSemesterId, setActiveSemesterId] = useState(initialSemesterId);

  // Sync state with query param
  useEffect(() => {
    const sem = searchParams.get('sem');
    if (sem && SEMESTERS_META.some(m => m.id === sem)) {
      setActiveSemesterId(sem);
    }
  }, [searchParams]);

  const activeMeta = SEMESTERS_META.find(m => m.id === activeSemesterId) || SEMESTERS_META[0];

  // Local state for courses to allow interactive dropdown selection before saving (or auto-saving directly)
  const [courses, setCourses] = useState<StudentCourseGrade[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', credit: 5, grade: '' });
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({ name: '', credit: 5 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from Context whenever the active semester changes
  useEffect(() => {
    setCourses(gradesHistory[activeSemesterId] || []);
  }, [activeSemesterId, gradesHistory]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGradeChange = (code: string, grade: string) => {
    const updated = courses.map(c => (c.code === code ? { ...c, grade } : c));
    setCourses(updated);
    saveSemesterGrades(activeSemesterId, updated);
    triggerToast('Grades auto-saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all grade selections for this semester?')) {
      deleteSemesterGrades(activeSemesterId);
      triggerToast('Semester grades cleared.');
    }
  };

  const handleSemesterChange = (id: string) => {
    setSearchParams({ sem: id });
    setActiveSemesterId(id);
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) {
      alert('Please fill out all fields.');
      return;
    }
    addCustomCourse(activeSemesterId, {
      code: newCourse.code.toUpperCase(),
      name: newCourse.name,
      credit: Number(newCourse.credit),
      grade: newCourse.grade
    });
    setNewCourse({ code: '', name: '', credit: 5, grade: '' });
    setShowAddModal(false);
    triggerToast('Custom course added!');
  };

  const startEditing = (course: StudentCourseGrade) => {
    setEditingCode(course.code);
    setEditFields({ name: course.name, credit: course.credit });
  };

  const saveEdit = (code: string) => {
    editCourse(activeSemesterId, code, {
      name: editFields.name,
      credit: Number(editFields.credit)
    });
    setEditingCode(null);
    triggerToast('Course details updated!');
  };

  const handleDeleteCourse = (code: string) => {
    if (window.confirm(`Are you sure you want to remove ${code} from this semester?`)) {
      deleteCourse(activeSemesterId, code);
      triggerToast('Course removed.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations
  const semesterGPA = calculateSemesterGPA(courses);
  const { total: totalCredits, completed: completedCredits } = calculateSemesterCredits(courses);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-gray-900/95 dark:bg-gray-100/95 px-4 py-3 text-xs font-black text-white dark:text-gray-900 shadow-xl transition-all border border-gray-800 dark:border-gray-200">
          <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Year & Semester Picker */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Select Academic Semester
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SEMESTERS_META.map((meta) => {
            const isSelected = meta.id === activeSemesterId;
            return (
              <button
                key={meta.id}
                onClick={() => handleSemesterChange(meta.id)}
                className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-xs font-black">{meta.yearName}</span>
                <span className="text-[10px] font-semibold opacity-80">{meta.semesterName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel & GPA Summary Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Course Grades Entry Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {activeMeta.yearName} - {activeMeta.semesterName} Courses
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Adjust grades, or edit/delete courses from your local timeline
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" /> Add Course
              </button>
              <button
                onClick={handleReset}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer shadow-xs transition-all"
                title="Clear Grades"
              >
                <RotateCcw className="h-4 w-4" /> Clear
              </button>
            </div>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xxs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Course Name</th>
                  <th className="py-2.5 px-3 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr
                      key={course.code}
                      className="group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                    >
                      {/* Code */}
                      <td className="py-3 px-3 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {course.code}
                      </td>

                      {/* Name / Edit Mode */}
                      <td className="py-3 px-3">
                        {editingCode === course.code ? (
                          <input
                            type="text"
                            value={editFields.name}
                            onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 py-1 text-xs text-slate-900 dark:text-white"
                          />
                        ) : (
                          <span className="font-bold text-slate-800 dark:text-slate-200">{course.name}</span>
                        )}
                      </td>

                      {/* Credits / Edit Mode */}
                      <td className="py-3 px-3 text-center font-bold">
                        {editingCode === course.code ? (
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={editFields.credit}
                            onChange={(e) => setEditFields({ ...editFields, credit: Number(e.target.value) })}
                            className="w-16 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2 py-1 text-center text-xs text-slate-900 dark:text-white"
                          />
                        ) : (
                          <span>{course.credit}</span>
                        )}
                      </td>

                      {/* Grade Selector */}
                      <td className="py-3 px-3 text-center">
                        <select
                          value={course.grade}
                          onChange={(e) => handleGradeChange(course.code, e.target.value)}
                          className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs font-black text-slate-800 dark:text-slate-100 shadow-sm cursor-pointer focus:border-blue-500"
                        >
                          <option value="">Select Grade</option>
                          {Object.keys(GRADE_POINTS).map((g) => (
                            <option key={g} value={g}>
                              {g} (GP: {GRADE_POINTS[g].toFixed(2)})
                            </option>
                          ))}
                          <option value="I">I (Incomplete)</option>
                          <option value="NG">NG (No Grade)</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          {editingCode === course.code ? (
                            <>
                              <button
                                onClick={() => saveEdit(course.code)}
                                className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-pointer"
                                title="Save changes"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingCode(null)}
                                className="p-1 rounded bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 cursor-pointer"
                                title="Cancel"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(course)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded transition-opacity cursor-pointer"
                                title="Edit Course Details"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.code)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded transition-opacity cursor-pointer"
                                title="Remove Course"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No courses in this semester yet. Click "Add Course" to start adding!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GPA Cards / Print Block */}
        <div className="space-y-4">
          {/* Main GPA Outcome Card */}
          <div className="rounded-2xl bg-linear-to-b from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
            <div className="text-xxs font-black uppercase tracking-wider text-blue-100">
              {activeMeta.shortName} Results
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-5xl font-black">{semesterGPA.toFixed(2)}</span>
              <p className="text-xs text-blue-100 mt-2 font-semibold">Semester GPA</p>
            </div>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-200 font-medium">Credits Earned</span>
                <span className="font-bold">{completedCredits} Credits</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-200 font-medium">Total Semester Credits</span>
                <span className="font-bold">{totalCredits} Credits</span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-blue-700 hover:bg-blue-50 transition-all cursor-pointer shadow-md shadow-black/10"
            >
              <Printer className="h-4 w-4" /> Print Semester Report
            </button>
          </div>

          {/* Scale Guide Card */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
              Department Grading Scale
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xxs font-bold text-gray-500 dark:text-gray-400">
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800/40 pb-1">
                <span>A+ / A = 4.00</span>
                <span>A- = 3.75</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800/40 pb-1">
                <span>B+ = 3.50</span>
                <span>B = 3.00</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800/40 pb-1">
                <span>B- = 2.75</span>
                <span>C+ = 2.50</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 dark:border-gray-800/40 pb-1">
                <span>C = 2.00</span>
                <span>C- = 1.75</span>
              </div>
              <div className="flex justify-between">
                <span>D = 1.00</span>
                <span>F = 0.00</span>
              </div>
              <div className="flex justify-between">
                <span>I = Incomplete</span>
                <span>NG = No Grade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 dark:bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Add Custom Course to {activeMeta.shortName}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xxs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., SE323"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xxs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Parallel Programming"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                    Credit Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCourse.credit}
                    onChange={(e) => setNewCourse({ ...newCourse, credit: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xxs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                    Grade (Optional)
                  </label>
                  <select
                    value={newCourse.grade}
                    onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                    className="w-full h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-3 text-sm text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="">Select</option>
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                    <option value="I">I</option>
                    <option value="NG">NG</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer shadow-3xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-black text-white cursor-pointer shadow-md shadow-blue-600/10"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
