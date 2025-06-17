import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student, Exam, StudentResult, StudentResultsResponse, Question } from '../models/admin.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getStudentResults(studentId: number): Observable<StudentResultsResponse> {
    return this.http.get<StudentResultsResponse>(`${this.apiUrl}/students/${studentId}/results`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/exams`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getExam(examId: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/exams/${examId}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  createExam(exam: Partial<Exam>): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/exams`, exam)
      .pipe(catchError(this.errorHandler.handleError));
  }

  updateExam(examId: number, exam: Partial<Exam>): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/exams/${examId}`, exam)
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteExam(examId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exams/${examId}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getExamQuestions(examId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/exams/${examId}/questions`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  addQuestion(examId: number, question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/exams/${examId}/questions`, question)
      .pipe(catchError(this.errorHandler.handleError));
  }

  updateQuestion(examId: number, questionId: number, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/exams/${examId}/questions/${questionId}`, question)
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteQuestion(examId: number, questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exams/${examId}/questions/${questionId}`)
      .pipe(catchError(this.errorHandler.handleError));
  }
} 