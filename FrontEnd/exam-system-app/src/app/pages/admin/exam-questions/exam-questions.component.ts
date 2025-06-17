import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NotificationService } from '../../../services/notification.service';
import { Exam, Question } from '../../../models/admin.interface';
import { HeaderComponent } from '../../../Component/header/header.component';
import { SidebarComponent } from '../../../Component/sidebar/sidebar.component';

@Component({
  selector: 'app-exam-questions',
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
    <div class="main-wrapper">
      <!-- Header -->
      <app-header></app-header>

      <!-- Content Section with Sidebar -->
      <div class="content-section d-flex">
        <app-sidebar></app-sidebar>
        
        <div class="content flex-grow-1">
          <div class="container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2>Question Management</h2>
              <div>
                <button class="btn btn-secondary me-2" [routerLink]="['/admin/exam-management']">
                  Back to Exams
                </button>
                <button class="btn btn-primary" (click)="showAddQuestionModal()">
                  Add New Question
                </button>
              </div>
            </div>

            <div class="card mb-4" *ngIf="exam">
              <div class="card-body">
                <h5 class="card-title">{{exam.title}}</h5>
                <p class="card-text">{{exam.description}}</p>
                <div class="exam-details">
                  <span class="badge bg-info me-2">Duration: {{exam.duration}} minutes</span>
                  <span class="badge bg-success">Total Marks: {{exam.totalMarks}}</span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Options</th>
                        <th>Correct Answer</th>
                        <th>Marks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let question of exam?.questions">
                        <td>{{question.text}}</td>
                        <td>
                          <ul class="list-unstyled mb-0">
                            <li *ngFor="let option of question.options" 
                                [class.text-success]="option === question.correctAnswer">
                              {{option}}
                            </li>
                          </ul>
                        </td>
                        <td>{{question.correctAnswer}}</td>
                        <td>{{question.marks}}</td>
                        <td>
                          <button class="btn btn-warning btn-sm me-2" 
                                  (click)="editQuestion(question)">
                            Edit
                          </button>
                          <button class="btn btn-danger btn-sm" 
                                  (click)="deleteQuestion(question.id)">
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
        </div>
      </div>
    </div>

    <!-- Add/Edit Question Modal -->
    <div class="modal fade" id="questionModal" tabindex="-1" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{isEditing ? 'Edit' : 'Add'}} Question</h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Question Text</label>
                <textarea class="form-control" formControlName="text" rows="3"></textarea>
              </div>
              
              <div formArrayName="options" class="mb-3">
                <label class="form-label">Options</label>
                <div *ngFor="let option of optionsArray.controls; let i = index" class="mb-2">
                  <div class="input-group">
                    <input type="text" class="form-control" [formControlName]="i">
                    <button type="button" class="btn btn-outline-danger" 
                            (click)="removeOption(i)" *ngIf="optionsArray.length > 2">
                      Remove
                    </button>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary" (click)="addOption()">
                  Add Option
                </button>
              </div>

              <div class="mb-3">
                <label class="form-label">Correct Answer</label>
                <select class="form-select" formControlName="correctAnswer">
                  <option *ngFor="let option of optionsArray.controls; let i = index" 
                          [value]="option.value">
                    {{option.value}}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Marks</label>
                <input type="number" class="form-control" formControlName="marks">
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="!questionForm.valid">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-wrapper {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .content-section {
      min-height: calc(100vh - 56px);
      background-color: #fff;
    }

    .content {
      padding: 20px;
      margin-left: 250px;
      margin-top: 56px;
    }

    .modal {
      background-color: rgba(0, 0, 0, 0.5);
    }

    .exam-details {
      margin-top: 1rem;
    }

    .badge {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
    }

    .text-success {
      color: #198754 !important;
      font-weight: 500;
    }

    .table {
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
  `]
})
export class ExamQuestionsComponent implements OnInit {
  exam: Exam | null = null;
  questionForm: FormGroup;
  showModal = false;
  isEditing = false;
  currentQuestionId: number | null = null;

  get optionsArray() {
    return this.questionForm.get('options') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.questionForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(10)]],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswer: ['', Validators.required],
      marks: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    if (examId) {
      this.loadExam(examId);
    }
  }

  loadExam(examId: number): void {
    this.adminService.getExam(examId).subscribe({
      next: (exam: Exam) => {
        this.exam = exam;
      },
      error: (error: any) => {
        this.notificationService.error('Failed to load exam: ' + error.message);
      }
    });
  }

  showAddQuestionModal(): void {
    this.isEditing = false;
    this.questionForm.reset();
    this.optionsArray.clear();
    this.addOption();
    this.addOption();
    this.showModal = true;
  }

  editQuestion(question: Question): void {
    this.isEditing = true;
    this.currentQuestionId = question.id;
    
    // Clear existing options
    this.optionsArray.clear();
    
    // Add options from the question
    question.options.forEach(option => {
      this.optionsArray.push(this.fb.control(option, Validators.required));
    });

    this.questionForm.patchValue({
      text: question.text,
      correctAnswer: question.correctAnswer,
      marks: question.marks
    });

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.questionForm.reset();
    this.currentQuestionId = null;
  }

  addOption(): void {
    this.optionsArray.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.questionForm.valid && this.exam) {
      const questionData = this.questionForm.value;
      
      if (this.isEditing && this.currentQuestionId) {
        this.adminService.updateQuestion(this.exam.id, this.currentQuestionId, questionData)
          .subscribe({
            next: () => {
              this.loadExam(this.exam!.id);
              this.notificationService.success('Question updated successfully');
              this.closeModal();
            },
            error: (error: any) => {
              this.notificationService.error('Failed to update question: ' + error.message);
            }
          });
      } else {
        this.adminService.addQuestion(this.exam.id, questionData).subscribe({
          next: () => {
            this.loadExam(this.exam!.id);
            this.notificationService.success('Question added successfully');
            this.closeModal();
          },
          error: (error: any) => {
            this.notificationService.error('Failed to add question: ' + error.message);
          }
        });
      }
    }
  }

  deleteQuestion(questionId: number): void {
    if (this.exam && confirm('Are you sure you want to delete this question?')) {
      this.adminService.deleteQuestion(this.exam.id, questionId).subscribe({
        next: () => {
          this.loadExam(this.exam!.id);
          this.notificationService.success('Question deleted successfully');
        },
        error: (error: any) => {
          this.notificationService.error('Failed to delete question: ' + error.message);
        }
      });
    }
  }
} 