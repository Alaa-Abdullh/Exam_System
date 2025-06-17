import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    // Log the error
    console.error(errorMessage);

    // You could also show a user-friendly message here
    // For example, using a toast notification service

    return throwError(() => new Error(errorMessage));
  }

  handleFormError(error: any): string {
    if (error.required) {
      return 'This field is required';
    }
    if (error.minlength) {
      return `Minimum length is ${error.minlength.requiredLength} characters`;
    }
    if (error.email) {
      return 'Please enter a valid email address';
    }
    if (error.min) {
      return `Minimum value is ${error.min.min}`;
    }
    return 'Invalid input';
  }
} 