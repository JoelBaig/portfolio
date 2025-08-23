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

  mailTest = true;

  post = {
    endPoint: 'https://deineDomain.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  // onSubmit(ngForm: NgForm) {
  //   if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
  //     this.http.post(this.post.endPoint, this.post.body(this.contactData))
  //       .subscribe({
  //         next: (response) => {

  //           ngForm.resetForm();
  //         },
  //         error: (error) => {
  //           console.error(error);
  //         },
  //         complete: () => console.info('send post complete'),
  //       });
  //   } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {

  //     ngForm.resetForm();
  //   }
  // }
}
