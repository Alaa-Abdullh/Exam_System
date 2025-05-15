// list-exam.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamService, Exam } from '../../services/exam.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-exam.component.html',
  styleUrls: ['./list-exam.component.css']
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  takenExams: Set<number> = new Set();

  constructor(
    public examService: ExamService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadExams();
    this.loadTakenExams();
  }

  // باقي الدوال تبقى كما هي
  loadExams() {
    this.isLoading = true;
    this.errorMessage = '';

    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load exams. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  loadTakenExams() {
    this.examService.getStudentResults().subscribe({
      next: (results) => {
        this.takenExams = new Set(results.map(result => result.examId));
      },
      error: (error) => {
        console.error('Failed to load taken exams:', error);
      }
    });
  }

  canTakeExam(exam: Exam): boolean {
    return !this.takenExams.has(exam.id);
  }
}