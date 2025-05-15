import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar" [class.open]="sidebarOpen">
      <nav>
        <ul>
          <ng-container *ngIf="isAdmin; else studentMenu">
            <!-- Admin Menu -->
            <li>
              <a routerLink="/admin/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt"></i>
                Dashboard
              </a>
            </li>
            <li>
              <a routerLink="/admin/exams" routerLinkActive="active">
                <i class="fas fa-file-alt"></i>
                Manage Exams
              </a>
            </li>
            <li>
              <a routerLink="/admin/results" routerLinkActive="active">
                <i class="fas fa-chart-bar"></i>
                View Results
              </a>
            </li>
          </ng-container>

          <ng-template #studentMenu>
            <!-- Student Menu -->
            <li>
              <a routerLink="/student/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt"></i>
                Dashboard
              </a>
            </li>
            <li>
              <a routerLink="/student/exams" routerLinkActive="active">
                <i class="fas fa-file-alt"></i>
                Available Exams
              </a>
            </li>
            <li>
              <a routerLink="/student/results" routerLinkActive="active">
                <i class="fas fa-chart-bar"></i>
                My Results
              </a>
            </li>
          </ng-template>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #2c3e50;
      color: white;
      height: 100%;
      padding: 20px 0;
      transition: transform 0.3s ease;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -250px;
        top: 0;
        bottom: 0;
        z-index: 1000;
      }

      .sidebar.open {
        transform: translateX(250px);
      }
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    nav ul li {
      padding: 10px 20px;
    }

    nav ul li a {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    nav ul li a:hover {
      color: #3498db;
    }

    nav ul li a.active {
      color: #3498db;
      font-weight: bold;
    }

    i {
      width: 20px;
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() sidebarOpen = false;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }
}