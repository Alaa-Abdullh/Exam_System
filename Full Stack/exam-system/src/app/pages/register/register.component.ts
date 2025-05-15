import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'

})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: ''

    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: RegisterData = {
        ...this.registerForm.value,
        roles: 'user'

      };
      console.log("this data req",this.registerForm.valid);
      

      this.authService.register(userData).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'login Faild';
        }
      });
    }
  }
} 