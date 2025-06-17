import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// import { MainPageComponent } from './pages/main-page/main-page.component';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';
// import { RegisterComponent } from "./register/register.component";
// import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  template: `
    <app-notification></app-notification>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'exam-system-app';
}
