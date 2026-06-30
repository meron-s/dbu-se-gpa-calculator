import { StudentCourseGrade, GPAHistory } from '../types';

export const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.75,
  'B+': 3.5,
  'B': 3.0,
  'B-': 2.75,
  'C+': 2.5,
  'C': 2.0,
  'C-': 1.75,
  'D': 1.0,
  'F': 0.0,
};

export function gradeToPoint(grade: string): number {
  return GRADE_POINTS[grade] !== undefined ? GRADE_POINTS[grade] : -1;
}

export function isCalculableGrade(grade: string): boolean {
  return GRADE_POINTS[grade] !== undefined;
}

export function calculateSemesterGPA(courses: StudentCourseGrade[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    if (isCalculableGrade(course.grade)) {
      const pts = gradeToPoint(course.grade);
      totalPoints += pts * course.credit;
      totalCredits += course.credit;
    }
  }

  if (totalCredits === 0) return 0.0;
  return Number((totalPoints / totalCredits).toFixed(2));
}

export function calculateSemesterCredits(courses: StudentCourseGrade[]): { total: number; completed: number } {
  let total = 0;
  let completed = 0;
  for (const course of courses) {
    total += course.credit;
    if (course.grade && course.grade !== 'I' && course.grade !== 'NG' && course.grade !== 'F') {
      completed += course.credit;
    }
  }
  return { total, completed };
}

export function calculateCGPA(history: GPAHistory): { cgpa: number; totalCredits: number; completedCredits: number } {
  let totalPoints = 0;
  let totalCredits = 0;
  let completedCredits = 0;

  for (const semesterId of Object.keys(history)) {
    const courses = history[semesterId] || [];
    for (const course of courses) {
      if (isCalculableGrade(course.grade)) {
        const pts = gradeToPoint(course.grade);
        totalPoints += pts * course.credit;
        totalCredits += course.credit;
        if (course.grade !== 'F') {
          completedCredits += course.credit;
        }
      } else if (course.grade === 'I' || course.grade === 'NG') {
        // Count in total credit requirement, but not completed unless a real grade is entered
      }
    }
  }

  const cgpa = totalCredits === 0 ? 0.0 : Number((totalPoints / totalCredits).toFixed(2));
  return {
    cgpa,
    totalCredits,
    completedCredits
  };
}

export function getGraduationClass(cgpa: number): string {
  if (cgpa >= 3.75) return 'Very Great Distinction (Excellent)';
  if (cgpa >= 3.5) return 'Great Distinction (Very Good)';
  if (cgpa >= 3.0) return 'Distinction (Good)';
  if (cgpa >= 2.0) return 'Pass';
  return 'Fail / Academic Dismissal Warning';
}

export function predictCGPA(
  currentCGPA: number,
  currentCredits: number,
  targetGPA: number,
  futureCredits: number
): number {
  const currentTotalPoints = currentCGPA * currentCredits;
  const futureTotalPoints = targetGPA * futureCredits;
  const finalTotalCredits = currentCredits + futureCredits;

  if (finalTotalCredits === 0) return 0.0;
  return Number(((currentTotalPoints + futureTotalPoints) / finalTotalCredits).toFixed(2));
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to local storage', e);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading from local storage', e);
    return defaultValue;
  }
}
