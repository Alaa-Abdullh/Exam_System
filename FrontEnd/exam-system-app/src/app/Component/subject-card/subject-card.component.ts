import { Component } from '@angular/core';

@Component({
  selector: 'app-subject-card',
  imports: [],
  templateUrl: './subject-card.component.html',
  styleUrl: './subject-card.component.css'
})
export class SubjectCardComponent {
  subjects = [
    { name: 'Mathematics', image: 'path/to/math-image.jpg' },
    { name: 'Programming', image: 'path/to/programming-image.jpg' },
    { name: 'Islamic Studies', image: 'path/to/islamic-studies-image.jpg' },
    { name: 'Web Engineering', image: 'path/to/web-engineering-image.jpg' }
  ];
}
