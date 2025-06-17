import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NotificationService } from '../../../services/notification.service';
import { Student } from '../../../models/admin.interface';
import { HeaderComponent } from '../../../Component/header/header.component';
import { SidebarComponent } from '../../../Component/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="admin-layout">
      <app-header class="admin-header"></app-header>
      <app-sidebar class="admin-sidebar"></app-sidebar>
      <main class="admin-content">
        <div class="container-fluid mt-4">
          <h2>Admin Dashboard</h2>
          <div class="row mb-4">
            <div class="col">
              <div class="input-group">
                <input type="text" 
                       class="form-control" 
                       placeholder="Search students..." 
                       [(ngModel)]="searchTerm"
                       (ngModelChange)="filterStudents()">
              </div>
            </div>
          </div>

          <div class="row">
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
                    <tr *ngFor="let student of filteredStudents">
                      <td>{{student.id}}</td>
                      <td>{{student.name}}</td>
                      <td>{{student.email}}</td>
                      <td>
                        <button class="btn btn-primary btn-sm me-2" 
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

          <!-- Quick Stats -->
          <div class="row mt-4">
            <div class="col-md-4">
              <div class="card bg-primary text-white">
                <div class="card-body">
                  <h5 class="card-title">Total Students</h5>
                  <p class="card-text display-4">{{ students.length }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-success text-white">
                <div class="card-body">
                  <h5 class="card-title">Active Exams</h5>
                  <p class="card-text display-4">{{ activeExams }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-info text-white">
                <div class="card-body">
                  <h5 class="card-title">Total Questions</h5>
                  <p class="card-text display-4">{{ totalQuestions }}</p>
                </div>
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
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .display-4 {
      font-size: 2.5rem;
      font-weight: 600;
    }
    .input-group {
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  activeExams: number = 0;
  totalQuestions: number = 0;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadStats();
  }

  loadStudents(): void {
    this.adminService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.filteredStudents = students;
      },
      error: (error) => {
        this.notificationService.error('Failed to load students: ' + error.message);
      }
    });
  }

  loadStats(): void {
    // TODO: Implement stats loading from backend
    this.activeExams = 5; // Placeholder
    this.totalQuestions = 50; // Placeholder
  }

  filterStudents(): void {
    if (!this.searchTerm) {
      this.filteredStudents = this.students;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  }
} 