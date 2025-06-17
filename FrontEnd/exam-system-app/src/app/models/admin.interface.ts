export interface Student {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

export interface StudentResult {
  id: number;
  examId: number;
  examTitle: string;
  score: number;
  dateTaken: Date;
  correctAnswers: number;
  totalQuestions: number;
  student?: Student; // Optional if needed in some contexts
}

export interface StudentResultsResponse {
  student: Student;
  results: StudentResult[];
} 