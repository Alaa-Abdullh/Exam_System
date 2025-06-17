import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { AddExamComponent } from './pages/add-exam/add-exam.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { StudentResultsComponent } from './pages/admin/student-results/student-results.component';
import { ExamManagementComponent } from './pages/admin/exam-management/exam-management.component';
import { ExamQuestionsComponent } from './pages/admin/exam-questions/exam-questions.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'about', component: AboutusComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'add-exam', component: AddExamComponent },
  
  // Admin routes
  { path: 'admin', children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboardComponent },
    { path: 'student-results', component: StudentResultsComponent },
    { path: 'student-results/:id', component: StudentResultsComponent },
    { path: 'exam-management', component: ExamManagementComponent },
    { path: 'exam-questions/:id', component: ExamQuestionsComponent }
  ]}
];