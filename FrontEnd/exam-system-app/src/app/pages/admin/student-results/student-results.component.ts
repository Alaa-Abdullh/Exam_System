import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { NotificationService } from '../../../services/notification.service';
import { Student, StudentResult, StudentResultsResponse } from '../../../models/admin.interface';
import { HeaderComponent } from '../../../Component/header/header.component';
import { SidebarComponent } from '../../../Component/sidebar/sidebar.component';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="admin-layout">
      <app-header class="admin-header"></app-header>
      <app-sidebar class="admin-sidebar"></app-sidebar>
      <main class="admin-content">
        <div class="container-fluid mt-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Student Results</h2>
            <button class="btn btn-secondary" routerLink="/admin/dashboard">
              Back to Dashboard
            </button>
          </div>

          <!-- Student List View -->
          <div *ngIf="!studentId" class="row">
            <div class="col">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let student of students">
                      <td>{{student.id}}</td>
                      <td>{{student.name}}</td>
                      <td>{{student.email}}</td>
                      <td>
                        <button class="btn btn-primary btn-sm" 
                                [routerLink]="['/admin/student-results', student.id]">
                          View Results
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Individual Student Results View -->
          <div *ngIf="studentId && student" class="row">
            <div class="col">
              <div class="card mb-4">
                <div class="card-body">
                  <h5 class="card-title">Student Information</h5>
                  <div class="student-info">
                    <p class="card-text"><strong>Name:</strong> {{student.name}}</p>
                    <p class="card-text"><strong>Email:</strong> {{student.email}}</p>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Score</th>
                      <th>Date Taken</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let result of results">
                      <td>{{result.examTitle}}</td>
                      <td>{{result.score}}%</td>
                      <td>{{result.dateTaken | date}}</td>
                      <td>
                        <span class="badge" 
                              [class.bg-success]="result.score >= 60"
                              [class.bg-danger]="result.score < 60">
                          {{result.score >= 60 ? 'Passed' : 'Failed'}}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }
    .admin-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 56px;
      z-index: 1000;
    }
    .admin-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 250px;
      height: 100vh;
      z-index: 999;
      background: #007bff;
    }
    .admin-content {
      margin-left: 250px;
      margin-top: 56px;
      padding: 24px 24px 24px 24px;
      width: 100%;
      min-height: calc(100vh - 56px);
      background: #fff;
      box-sizing: border-box;
    }
    .table {
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .badge {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border-radius: 20px;
    }
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: none;
      border-radius: 8px;
    }
    .card-title {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .student-info {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
    }
    .student-info p {
      margin-bottom: 0.5rem;
    }
    .student-info strong {
      color: #2c3e50;
      margin-right: 0.5rem;
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      border-radius: 4px;
    }
    .btn-secondary {
      background-color: #6c757d;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .btn-secondary:hover {
      background-color: #5a6268;
    }
  `]
})
export class StudentResultsComponent implements OnInit {
  students: Student[] = [];
  studentId: number | null = null;
  student: Student | null = null;
  results: StudentResult[] = [];

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.studentId) {
      this.loadStudentResults();
    } else {
      this.loadAllStudents();
    }
  }

  loadAllStudents() {
    this.adminService.getAllStudents().subscribe({
      next: (students: Student[]) => {
        this.students = students;
      },
      error: (error: any) => {
        this.notificationService.error('Failed to load students: ' + error.message);
      }
    });
  }

  loadStudentResults() {
    if (this.studentId) {
      this.adminService.getStudentResults(this.studentId).subscribe({
        next: (data: StudentResultsResponse) => {
          this.student = data.student;
          this.results = data.results;
        },
        error: (error: any) => {
          this.notificationService.error('Failed to load student results: ' + error.message);
        }
      });
    }
  }
} 