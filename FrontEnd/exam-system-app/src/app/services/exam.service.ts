import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/exams'; 

  constructor(private http: HttpClient) {}

  createExam(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating exam', error);
        return throwError(() => new Error(error));
      })
    );
  }
  getExams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching exams', error);
        return throwError(() => new Error(error));
      })
    );
  }

  updateExam(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating exam', error);
        return throwError(() => new Error(error));
      })
    );
  }

  deleteExam(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting exam', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
