import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ExamListComponent } from './pages/exam-list/list-exam.component';
import { TakeExamComponent } from './pages/take-exam/take-exam.component';
import { ResultsComponent } from './pages/results/results.component';
import { ChooseRoleComponent } from './pages/choose-role/choose-role.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const studentGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && !authService.isAdmin()) {
    return true;
  }

  return router.parseUrl('/login');
};

const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  return router.parseUrl('/admin/login');
};

export const routes: Routes = [
  { path: '', redirectTo: '/choose-role', pathMatch: 'full' },
  { path: 'choose-role', component: ChooseRoleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/login', component: LoginComponent },
  
  // Student routes
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [studentGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'exams', component: ExamListComponent },
      { path: 'take-exam/:id', component: TakeExamComponent },
      { path: 'results', component: ResultsComponent }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardComponent }, // You'll need to create an admin dashboard component
      { path: 'exams', component: ExamListComponent },
      { path: 'results', component: ResultsComponent }
    ]
  },

  { path: '**', redirectTo: '/choose-role' }
];
