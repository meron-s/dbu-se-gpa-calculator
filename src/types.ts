export interface Course {
  code: string;
  name: string;
  credit: number;
}

export interface StudentCourseGrade extends Course {
  grade: string; // A, A-, B+, etc.
}

export type GradeScaleKey = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F' | 'I' | 'NG';

export interface SemesterData {
  id: string; // e.g., 'year2Semester1'
  yearName: string; // e.g., 'Year 2'
  semesterName: string; // e.g., 'Semester I'
  shortName: string; // e.g., 'Y2 S I'
  courses: StudentCourseGrade[];
}

export interface GPAHistory {
  [semesterId: string]: StudentCourseGrade[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  colorClass: string;
}

export interface AppState {
  gradesHistory: GPAHistory;
  theme: 'light' | 'dark';
  selectedYear: string;
  selectedSemester: string;
}
