export interface Subject {
  code: string;
  name: string;
  credits: number;
}

export const semester1Subjects: Subject[] = [
  { code: 'JHS2121', name: 'English for Communicative Competence', credits: 3 },
  { code: 'JGE2102', name: 'Heritage of Tamils', credits: 1 },
  { code: 'JMA2121', name: 'Matrices and Calculus', credits: 3 },
  { code: 'JPH2101', name: 'Engineering Physics 1', credits: 3 },
  { code: 'JCY2101', name: 'Engineering Chemistry', credits: 3 },
  { code: 'JGE2101', name: 'Basic Engineering', credits: 3 },
  { code: 'JCS2121', name: 'Programming in C', credits: 4 },
  { code: 'JPC2111', name: 'Engineering Physics and Chemistry Laboratory', credits: 1 },
  { code: 'JGE2111', name: 'Basic Engineering Laboratory', credits: 1 },
];

export const semester2Subjects: Subject[] = [
  { code: 'JHS2221', name: 'English for Science and Technology', credits: 3 },
  { code: 'JGE2202', name: 'Tamils and Technology', credits: 1 },
  { code: 'JMA2221', name: 'Statistics for Engineers', credits: 3 },
  { code: 'JPH2201', name: 'Engineering Physics 2', credits: 3 },
  { code: 'JCY2201', name: 'Environmental Science and Sustainability', credits: 2 },
  { code: 'JGE2221', name: 'Engineering Graphics', credits: 3 },
  { code: 'JCS2201', name: 'Python Programming', credits: 3 },
  { code: 'JPC2211', name: 'Engineering Physics and Environmental Science Laboratory', credits: 1 },
  { code: 'JCS2211', name: 'Python Programming Laboratory', credits: 2 },
  { code: 'JGE2241', name: 'Gaming and Crafts Studio', credits: 2 },
];

export const semester3Subjects: Subject[] = [
  { code: 'JMA2302', name: 'Mathematical Foundations for Computer Science', credits: 3 },
  { code: 'JCS2301', name: 'Object Oriented Programming', credits: 3 },
  { code: 'JCS2302', name: 'Data Structures and Algorithms', credits: 3 },
  { code: 'JCS2303', name: 'Data Science', credits: 3 },
  { code: 'JCS2321', name: 'Digital Principles and Computer Organization', credits: 4 },
  { code: 'JNC2361', name: 'Non-Credit Mandatory Course 1', credits: 0 },
  { code: 'JCS2311', name: 'Data Structures and Algorithms Laboratory', credits: 2 },
  { code: 'JCS2312', name: 'Object Oriented Programming Laboratory', credits: 2 },
  { code: 'JPT2041_S3', name: 'Soft Skills and Aptitude', credits: 0 },
];

export const semester4Subjects: Subject[] = [
  { code: 'JMA2402', name: 'Applied Linear Algebra', credits: 3 },
  { code: 'JCS2401', name: 'Database Management Systems', credits: 3 },
  { code: 'JCS2421', name: 'Operating Systems', credits: 4 },
  { code: 'JCS2422', name: 'Design and Analysis of Algorithms', credits: 4 },
  { code: 'JPE2401', name: 'Professional Elective 1', credits: 3 },
  { code: 'JOE2401', name: 'Open Elective 1', credits: 3 },
  { code: 'JCS2411', name: 'Database Management Systems Laboratory', credits: 2 },
  { code: 'JPT2041_S4', name: 'Soft Skills and Aptitude', credits: 1 },
  { code: 'JGE2442', name: 'Advanced IT Infrastructure Laboratory', credits: 2 },
];

export const semester5Subjects: Subject[] = [
  { code: 'JMA2501', name: 'Optimization Techniques', credits: 3 },
  { code: 'JCS2501', name: 'Computer Networks', credits: 3 },
  { code: 'JCS2521', name: 'Object Oriented Software Engineering', credits: 4 },
  { code: 'JCS2522', name: 'Automata Theory and Compiler Design', credits: 4 },
  { code: 'JPE2501', name: 'Professional Elective 2', credits: 3 },
  { code: 'JOE2501', name: 'Open Elective 2', credits: 3 },
  { code: 'JCS2511', name: 'Computer Networks Laboratory', credits: 2 },
  { code: 'JPT2042_S5', name: 'Technical Skills and Aptitude', credits: 0 },
  { code: 'JGE2542', name: 'MERN Stack Development Laboratory', credits: 2 },
];

export const semester6Subjects: Subject[] = [
  { code: 'JCS2621', name: 'Internet and Web Programming', credits: 4 },
  { code: 'JCS2601', name: 'Cryptography and Network Security', credits: 3 },
  { code: 'JCS2602', name: 'Cloud Computing', credits: 3 },
  { code: 'JPE2601', name: 'Professional Elective 3', credits: 3 },
  { code: 'JPE2602', name: 'Professional Elective 4', credits: 3 },
  { code: 'JOE2601', name: 'Open Elective 3', credits: 3 },
  { code: 'JHS2541', name: 'Professional Communication', credits: 1 },
  { code: 'JCS2611', name: 'Cryptography and Network Security Laboratory', credits: 2 },
  { code: 'JPT2042_S6', name: 'Technical Skills and Aptitude', credits: 1 },
  { code: 'JGE2642', name: 'Computational Intelligence Laboratory', credits: 2 },
];

export const semester7Subjects: Subject[] = [
  { code: 'JPE2701', name: 'Professional Elective 5', credits: 3 },
  { code: 'JPE2702', name: 'Professional Elective 6', credits: 3 },
  { code: 'JOE2701', name: 'Open Elective 4', credits: 3 },
  { code: 'JNC2761', name: 'Non-Credit Mandatory Course 2', credits: 0 },
  { code: 'JHS2741', name: 'Entrepreneurship for Engineers', credits: 1 },
  { code: 'JCS2741', name: 'Comprehension and Technical Seminar', credits: 1 },
  { code: 'JCS2742', name: 'Internship', credits: 2 },
];

export const semester8Subjects: Subject[] = [
  { code: 'JCS2831', name: 'Project Work', credits: 10 },
];

export const allSemestersSubjects: Subject[][] = [
  semester1Subjects,
  semester2Subjects,
  semester3Subjects,
  semester4Subjects,
  semester5Subjects,
  semester6Subjects,
  semester7Subjects,
  semester8Subjects,
];

export const gradePoints: Record<string, number> = {
  'S': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6.5,
  'C+': 6,
  'C': 5,
  'U': 0,
  'SA': 0,
  'WC': 0,
};
