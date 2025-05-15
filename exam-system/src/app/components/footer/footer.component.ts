import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Exam System. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      text-align: center;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent {}
