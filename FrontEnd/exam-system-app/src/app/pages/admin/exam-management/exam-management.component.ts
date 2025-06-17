import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NotificationService } from '../../../services/notification.service';
import { Exam } from '../../../models/admin.interface';
import { HeaderComponent } from '../../../Component/header/header.component';
import { SidebarComponent } from '../../../Component/sidebar/sidebar.component';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent
  ],
  template: `
    <div class="admin-layout">
      <app-header class="admin-header"></app-header>
      <app-sidebar class="admin-sidebar"></app-sidebar>
      <main class="admin-content">
        <div class="container-fluid mt-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Exam Management</h2>
            <button class="btn btn-primary" (click)="showAddExamModal()">
              Add New Exam
            </button>
          </div>

          <div class="row">
            <div class="col">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Duration (minutes)</th>
                      <th>Total Marks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let exam of exams">
                      <td>
                        <a [routerLink]="['/admin/exam-questions', exam.id]" 
                           class="exam-title-link">
                          {{exam.title}}
                        </a>
                      </td>
                      <td>{{exam.duration}}</td>
                      <td>{{exam.totalMarks}}</td>
                      <td>
                        <button class="btn btn-info btn-sm me-2" 
                                [routerLink]="['/admin/exam-questions', exam.id]">
                          Manage Questions
                        </button>
                        <button class="btn btn-warning btn-sm me-2" 
                                (click)="editExam(exam)">
                          Edit
                        </button>
                        <button class="btn btn-danger btn-sm" 
                                (click)="deleteExam(exam.id)">
                          Delete
                        </button>
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

    <!-- Add/Edit Exam Modal -->
    <div class="modal fade" id="examModal" tabindex="-1" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{isEditing ? 'Edit' : 'Add'}} Exam</h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" formControlName="title">
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" formControlName="description" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Duration (minutes)</label>
                <input type="number" class="form-control" formControlName="duration">
              </div>
              <div class="mb-3">
                <label class="form-label">Total Marks</label>
                <input type="number" class="form-control" formControlName="totalMarks">
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!examForm.valid">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    .exam-title-link {
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
    }
    .exam-title-link:hover {
      color: #0056b3;
      text-decoration: underline;
    }
    .modal {
      background-color: rgba(0, 0, 0, 0.5);
    }
    .modal-content {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .form-label {
      font-weight: 500;
    }
    .btn-primary, .btn-info, .btn-warning, .btn-danger {
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
export class ExamManagementComponent implements OnInit {
  exams: Exam[] = [];
  examForm: FormGroup;
  showModal = false;
  isEditing = false;
  currentExamId: number | null = null;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      totalMarks: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.adminService.getAllExams().subscribe({
      next: (exams: Exam[]) => {
        this.exams = exams;
      },
      error: (error: any) => {
        this.notificationService.error('Failed to load exams: ' + error.message);
      }
    });
  }

  showAddExamModal(): void {
    this.isEditing = false;
    this.examForm.reset();
    this.showModal = true;
  }

  editExam(exam: Exam): void {
    this.isEditing = true;
    this.currentExamId = exam.id;
    this.examForm.patchValue({
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      totalMarks: exam.totalMarks
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.examForm.reset();
    this.currentExamId = null;
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      const examData = this.examForm.value;
      
      if (this.isEditing && this.currentExamId) {
        this.adminService.updateExam(this.currentExamId, examData).subscribe({
          next: () => {
            this.notificationService.success('Exam updated successfully');
            this.loadExams();
            this.closeModal();
          },
          error: (error: any) => {
            this.notificationService.error('Failed to update exam: ' + error.message);
          }
        });
      } else {
        this.adminService.createExam(examData).subscribe({
          next: () => {
            this.notificationService.success('Exam created successfully');
            this.loadExams();
            this.closeModal();
          },
          error: (error: any) => {
            this.notificationService.error('Failed to create exam: ' + error.message);
          }
        });
      }
    }
  }

  deleteExam(examId: number): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.adminService.deleteExam(examId).subscribe({
        next: () => {
          this.notificationService.success('Exam deleted successfully');
          this.loadExams();
        },
        error: (error: any) => {
          this.notificationService.error('Failed to delete exam: ' + error.message);
        }
      });
    }
  }
} 