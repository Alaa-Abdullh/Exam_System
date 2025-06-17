import { Component } from '@angular/core';
import { SidebarComponent} from '../../Component/sidebar/sidebar.component';
import { HeaderComponent } from '../../Component/header/header.component';

import { SubjectCardComponent } from '../../Component/subject-card/subject-card.component';
import { FooterComponent } from "../../Component/footer/footer.component";
@Component({
  selector: 'app-main-page',
  imports: [SidebarComponent, HeaderComponent, SubjectCardComponent, FooterComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {


}
