import type { Subject } from '../data/curriculum';
import { gradePoints } from '../data/curriculum';

export function calculateGPA(subjects: Subject[], selectedGrades: Record<string, string>): number | null {
  let totalGradePoints = 0;
  let totalCredits = 0;
  let requiredGradedSubjects = 0;
  let filledGradedSubjects = 0;

  for (const subject of subjects) {
    if (subject.credits > 0) {
      requiredGradedSubjects++;
    }
    const grade = selectedGrades[subject.code];
    if (!grade) continue;

    if (subject.credits > 0) {
      filledGradedSubjects++;
    }

    const point = gradePoints[grade];
    if (point !== undefined) {
      totalGradePoints += point * subject.credits;
      totalCredits += subject.credits;
    }
  }

  if (requiredGradedSubjects > 0 && filledGradedSubjects < requiredGradedSubjects) {
    return null;
  }

  if (totalCredits === 0) return null;
  
  return totalGradePoints / totalCredits;
}

export function calculateCGPA(semesterResults: Array<{ gpa: number | null; totalCredits: number }>): number | null {
  let totalWeightedPoints = 0;
  let totalCredits = 0;
  let validSemesters = 0;

  for (const result of semesterResults) {
    if (result.gpa !== null) {
      totalWeightedPoints += result.gpa * result.totalCredits;
      totalCredits += result.totalCredits;
      validSemesters++;
    }
  }

  if (validSemesters === 0 || totalCredits === 0) return null;
  return totalWeightedPoints / totalCredits;
}

export function getSemesterTotalCredits(subjects: Subject[]): number {
  return subjects.reduce((sum, s) => sum + s.credits, 0);
}
