export interface SemesterMeta {
  id: string;
  yearName: string;
  semesterName: string;
  shortName: string;
  order: number;
}

export const SEMESTERS_META: SemesterMeta[] = [
  { id: 'year2Semester1', yearName: 'Year 2', semesterName: 'Semester I', shortName: 'Y2 S I', order: 1 },
  { id: 'year2Semester2', yearName: 'Year 2', semesterName: 'Semester II', shortName: 'Y2 S II', order: 2 },
  { id: 'year3Semester1', yearName: 'Year 3', semesterName: 'Semester I', shortName: 'Y3 S I', order: 3 },
  { id: 'year3Semester2', yearName: 'Year 3', semesterName: 'Semester II', shortName: 'Y3 S II', order: 4 },
  { id: 'year4Semester1', yearName: 'Year 4', semesterName: 'Semester I', shortName: 'Y4 S I', order: 5 },
  { id: 'year4Semester2', yearName: 'Year 4', semesterName: 'Semester II', shortName: 'Y4 S II', order: 6 },
  { id: 'year5Semester1', yearName: 'Year 5', semesterName: 'Semester I', shortName: 'Y5 S I', order: 7 },
  { id: 'year5Semester2', yearName: 'Year 5', semesterName: 'Semester II', shortName: 'Y5 S II', order: 8 }
];
