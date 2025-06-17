import { Component } from '@angular/core';
import { HeaderComponent } from '../../Component/header/header.component';
import { SidebarComponent } from '../../Component/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aboutus',
  imports: [HeaderComponent, SidebarComponent, CommonModule],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css',
})
export class AboutusComponent {}
