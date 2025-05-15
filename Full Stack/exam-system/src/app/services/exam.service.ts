import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

export interface ExamResult {
  id: number;
  examId: number;
  userId: number;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Get all available exams
  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/exams`);
  }

  // Get a specific exam by ID
  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/exams/${id}`);
  }

  // Submit exam answers
  submitExam(examId: number, answers: { questionId: number; answer: number }[]): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/exams/${examId}/submit`, { answers });
  }

  // Get student's exam results
  getStudentResults(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/student`);
  }

  // Get all students' results (admin only)
  getAllResults(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/all`);
  }

  // Create new exam (admin only)
  createExam(exam: Omit<Exam, 'id'>): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/exams`, exam);
  }

  // Update exam (admin only)
  updateExam(id: number, exam: Partial<Exam>): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/exams/${id}`, exam);
  }

  // Delete exam (admin only)
  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exams/${id}`);
  }
}
