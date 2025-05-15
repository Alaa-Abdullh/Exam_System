import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
// import { User } from './exam.service';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Update this with your backend URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  private setStoredUser(user: User | null): void {
    if (this.isBrowser) {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }

  private setStoredToken(token: string | null): void {
    if (this.isBrowser) {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private getStoredUser(): User | null {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          return null;
        }
      }
    }
    return null;
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            this.setStoredToken(response.data.token);
            this.setStoredUser(response.data.user);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout(): void {
    this.setStoredToken(null);
    this.setStoredUser(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/choose-role']);
  }

  isLoggedIn(): boolean {
    // console.log(!!this.currentUserSubject.value);
    
    return !!this.currentUserSubject.value;
  }



  // console.log(this.isLoggedIn());
  

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    // return user ? user.roles-- : false;
    return user?.roles === 'admin'
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
