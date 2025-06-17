import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../Component/header/header.component';
import { SidebarComponent } from '../../Component/sidebar/sidebar.component';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, SidebarComponent, HttpClientModule],
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css'],
})
export class AddExamComponent {
  examForm: FormGroup;

  constructor(private fb: FormBuilder, private examService: ExamService) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      createdBy: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      const formData = this.examForm.value;
      this.examService.createExam(formData).subscribe({
        next: (response) => {
          console.log('✅ Exam added successfully:', response);
        },
        error: (error) => {
          console.error('❌ Error adding exam:', error);
        },
      });
    }
  }
}
