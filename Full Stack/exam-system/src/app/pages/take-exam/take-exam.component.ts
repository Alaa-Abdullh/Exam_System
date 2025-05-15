import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService, Exam, Question } from '../../services/exam.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="exam-container" *ngIf="exam">
      <div class="exam-header">
        <h2>{{ exam.title }}</h2>
        <div class="timer" [class.warning]="timeRemaining <= 300">
          Time Remaining: {{ formatTime(timeRemaining) }}
        </div>
      </div>

      <div class="exam-progress">
        Question {{ currentQuestionIndex + 1 }} of {{ exam.questions.length }}
      </div>

      <div class="question-container" *ngIf="currentQuestion">
        <h3>{{ currentQuestion.text }}</h3>
        <div class="options">
          <div 
            *ngFor="let option of currentQuestion.options; let i = index"
            class="option"
            [class.selected]="answers[currentQuestionIndex] === i"
            (click)="selectAnswer(i)"
          >
            {{ option }}
          </div>
        </div>
      </div>

      <div class="navigation-buttons">
        <button 
          *ngIf="currentQuestionIndex > 0"
          (click)="previousQuestion()"
          class="nav-btn"
        >
          Previous
        </button>
        <button 
          *ngIf="currentQuestionIndex < exam.questions.length - 1"
          (click)="nextQuestion()"
          class="nav-btn"
        >
          Next
        </button>
        <button 
          *ngIf="currentQuestionIndex === exam.questions.length - 1"
          (click)="submitExam()"
          class="submit-btn"
          [disabled]="!isExamComplete()"
        >
          Submit Exam
        </button>
      </div>

      <div class="question-navigation">
        <div 
          *ngFor="let question of exam.questions; let i = index"
          class="question-number"
          [class.answered]="answers[i] !== undefined"
          [class.current]="i === currentQuestionIndex"
          (click)="goToQuestion(i)"
        >
          {{ i + 1 }}
        </div>
      </div>
    </div>

    <div *ngIf="!exam" class="loading">
      Loading exam...
    </div>
  `,
  styles: [`
    .exam-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .timer {
      font-size: 1.2rem;
      font-weight: bold;
      color: #28a745;
    }

    .timer.warning {
      color: #dc3545;
    }

    .exam-progress {
      text-align: center;
      color: #666;
      margin-bottom: 1rem;
    }

    .question-container {
      margin-bottom: 2rem;
    }

    .question-container h3 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .option {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option:hover {
      background-color: #f8f9fa;
    }

    .option.selected {
      background-color: #e3f2fd;
      border-color: #2196f3;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .nav-btn, .submit-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .nav-btn {
      background-color: #6c757d;
      color: white;
    }

    .nav-btn:hover {
      background-color: #5a6268;
    }

    .submit-btn {
      background-color: #28a745;
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: #218838;
    }

    .submit-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .question-navigation {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .question-number {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ddd;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;
    }

    .question-number:hover {
      background-color: #f8f9fa;
    }

    .question-number.answered {
      background-color: #e3f2fd;
      border-color: #2196f3;
    }

    .question-number.current {
      background-color: #2196f3;
      color: white;
      border-color: #2196f3;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class TakeExamComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  currentQuestionIndex: number = 0;
  answers: (number | undefined)[] = [];
  timeRemaining: number = 0;
  private timerSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    const examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExam(examId);
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadExam(examId: number) {
    this.examService.getExamById(examId).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.answers = new Array(exam.questions.length).fill(undefined);
        this.timeRemaining = exam.duration * 60; // Convert minutes to seconds
        this.startTimer();
      },
      error: (error) => {
        console.error('Failed to load exam:', error);
        this.router.navigate(['/exams']);
      }
    });
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.submitExam();
      }
    });
  }

  get currentQuestion(): Question | undefined {
    return this.exam?.questions[this.currentQuestionIndex];
  }

  selectAnswer(answerIndex: number) {
    this.answers[this.currentQuestionIndex] = answerIndex;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < (this.exam?.questions.length ?? 0) - 1) {
      this.currentQuestionIndex++;
    }
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < (this.exam?.questions.length ?? 0)) {
      this.currentQuestionIndex = index;
    }
  }

  isExamComplete(): boolean {
    return this.answers.every(answer => answer !== undefined);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  submitExam() {
    if (!this.exam) return;

    const answers = this.answers.map((answer, index) => ({
      questionId: this.exam!.questions[index].id,
      answer: answer ?? -1 // Use -1 for unanswered questions
    }));

    this.examService.submitExam(this.exam.id, answers).subscribe({
      next: (result) => {
        this.router.navigate(['/results', result.id]);
      },
      error: (error) => {
        console.error('Failed to submit exam:', error);
        // Handle error appropriately
      }
    });
  }
}
