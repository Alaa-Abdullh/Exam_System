import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="logo">
        <button class="menu-toggle" (click)="toggleMenu()" *ngIf="isLoggedIn">
          <i class="fas" [class.fa-bars]="!menuOpen" [class.fa-times]="menuOpen"></i>
        </button>
        <h1>Exam System</h1>
      </div>
      <div class="user-info" *ngIf="isLoggedIn">
        <span class="welcome-text">Welcome, {{ username }}</span>
        <button class="logout-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-toggle:hover {
      color: #3498db;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-text {
      font-size: 0.9rem;
    }

    .logout-btn {
      background-color: transparent;
      border: 1px solid white;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logout-btn:hover {
      background-color: white;
      color: #2c3e50;
    }

    @media (max-width: 768px) {
      .header {
        padding: 1rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Input() menuOpen = false;
  @Output() menuToggle = new EventEmitter<void>();
  
  isLoggedIn = false;
  username = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.username = user.username;
        }
      });
    }
  }

  toggleMenu() {
    this.menuToggle.emit();
  }

  logout() {
    this.authService.logout();
  }
}