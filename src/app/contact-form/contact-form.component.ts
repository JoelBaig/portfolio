import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { AppBtnComponent } from '../app-btn/app-btn.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    AppHeadlineComponent,
    AppBtnComponent,
    FormsModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {

  contactData = {
    contactName: '',
    email: '',
    message: '',
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
      console.log(this.contactData)
    }
  }
}
