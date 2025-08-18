import { Component } from '@angular/core';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-contact-form',
  imports: [
    AppHeadlineComponent,
    AppBtnComponent,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {

}
