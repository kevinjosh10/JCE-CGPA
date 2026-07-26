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

export function calculateTargetForecaster(
  semesterResults: Array<{ gpa: number | null; totalCredits: number }>,
  completedSems: number,
  targetCGPA: number
): { possible: boolean; requiredGPA: number; message: string } {
  let earnedPoints = 0;
  let earnedCredits = 0;
  
  // Calculate what they have so far
  for (let i = 0; i < completedSems; i++) {
    const res = semesterResults[i];
    if (res.gpa !== null) {
      earnedPoints += res.gpa * res.totalCredits;
      earnedCredits += res.totalCredits;
    }
  }

  // Calculate remaining credits in the whole 8-semester degree
  let remainingCredits = 0;
  let totalDegreeCredits = 0;
  for (let i = 0; i < 8; i++) {
    const res = semesterResults[i];
    totalDegreeCredits += res.totalCredits;
    // Any semester not yet completed, or completed but missing grades, counts as remaining
    if (i >= completedSems || (i < completedSems && res.gpa === null)) {
      remainingCredits += res.totalCredits;
    }
  }

  if (remainingCredits === 0) {
    return { possible: false, requiredGPA: 0, message: "No remaining credits to improve CGPA." };
  }

  const targetPoints = targetCGPA * totalDegreeCredits;
  const neededPoints = targetPoints - earnedPoints;
  const requiredGPA = neededPoints / remainingCredits;

  if (requiredGPA > 10) {
    return { possible: false, requiredGPA, message: `Impossible. You would need a ${requiredGPA.toFixed(2)}.` };
  }
  
  if (requiredGPA <= 0) {
    return { possible: true, requiredGPA: 0, message: `You've already secured this!` };
  }

  return { possible: true, requiredGPA, message: `You need a ${requiredGPA.toFixed(2)} avg.` };
}

export function getSemesterTotalCredits(subjects: Subject[]): number {
  return subjects.reduce((sum, s) => sum + s.credits, 0);
}
