import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamService, ExamResult } from '../../services/exam.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="results-container">
      <h2>{{ isAdmin ? 'All Students Results' : 'My Results' }}</h2>

      <div *ngIf="isLoading" class="loading">
        Loading results...
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="results-grid" *ngIf="!isLoading && !errorMessage">
        <div *ngFor="let result of results" class="result-card">
          <div class="result-header">
            <h3>Exam #{{ result.examId }}</h3>
            <span class="score" [class.passing]="isPassingScore(result)">
              {{ calculatePercentage(result) }}%
            </span>
          </div>

          <div class="result-details">
            <p>Score: {{ result.score }} / {{ result.totalQuestions }}</p>
            <p>Completed: {{ formatDate(result.completedAt) }}</p>
          </div>

          <div class="result-actions">
            <button 
              class="view-details-btn"
              [routerLink]="['/results', result.id]"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && !errorMessage && results.length === 0" class="no-results">
        No results available.
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .result-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .result-header h3 {
      margin: 0;
      color: #333;
    }

    .score {
      font-size: 1.5rem;
      font-weight: bold;
      color: #dc3545;
    }

    .score.passing {
      color: #28a745;
    }

    .result-details {
      margin-bottom: 1rem;
    }

    .result-details p {
      margin: 0.5rem 0;
      color: #666;
    }

    .result-actions {
      display: flex;
      justify-content: flex-end;
    }

    .view-details-btn {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .view-details-btn:hover {
      background-color: #0056b3;
    }

    .loading {
      text-align: center;
      color: #666;
      padding: 2rem;
    }

    .error-message {
      color: #dc3545;
      text-align: center;
      padding: 1rem;
      background-color: #f8d7da;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .no-results {
      text-align: center;
      color: #666;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  `]
})
export class ResultsComponent implements OnInit {
  results: ExamResult[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isAdmin: boolean = false;

  constructor(
    private examService: ExamService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.isLoading = true;
    this.errorMessage = '';

    const resultsObservable = this.isAdmin
      ? this.examService.getAllResults()
      : this.examService.getStudentResults();

    resultsObservable.subscribe({
      next: (results) => {
        this.results = results;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load results. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  calculatePercentage(result: ExamResult): number {
    return Math.round((result.score / result.totalQuestions) * 100);
  }

  isPassingScore(result: ExamResult): boolean {
    return this.calculatePercentage(result) >= 60;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
} 