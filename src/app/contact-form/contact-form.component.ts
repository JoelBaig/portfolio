// import { Component, inject } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { AppHeadlineComponent } from '../app-headline/app-headline.component';
// import { AppBtnComponent } from '../app-btn/app-btn.component';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-contact-form',
//   standalone: true,
//   imports: [
//     AppHeadlineComponent,
//     AppBtnComponent,
//     FormsModule,
//   ],
//   templateUrl: './contact-form.component.html',
//   styleUrl: './contact-form.component.scss'
// })
// export class ContactFormComponent {

//   http = inject(HttpClient)

//   contactData = {
//     contactName: '',
//     email: '',
//     message: '',
//   }

//   mailTest = false;

//   post = {
//     endPoint: 'https://joelbaig.com/sendMail.php',
//     body: (payload: any) => JSON.stringify(payload),
//     options: {
//       headers: {
//         'Content-Type': 'text/plain',
//         responseType: 'text',
//       },
//     },
//   };

//   onSubmit(ngForm: NgForm) {
//     if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
//       this.http.post(this.post.endPoint, this.post.body(this.contactData))
//         .subscribe({
//           next: (response) => {

//             ngForm.resetForm();
//           },
//           error: (error) => {
//             console.error(error);
//           },
//           complete: () => console.info('send post complete'),
//         });
//     } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {

//       ngForm.resetForm();
//     }
//   }
// }


import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    FormsModule,
    AppHeadlineComponent,
    NgStyle],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private http = inject(HttpClient);

  // Das passt zu deinen [(ngModel)]-Bindings im Template
  contactData = {
    contactName: '',
    email: '',
    message: '',
  };

  // Endpunkt: deine Domain mit der PHP-Datei
  endPoint = 'https://joelbaig.com/sendMail.php';

  // Zum Trocken-Üben (keine Mail schicken, nur Konsole)
  mailTest = false; // auf true setzen, wenn du NUR testen willst

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    if (this.mailTest) {
      console.log('TEST MODE – wird NICHT gesendet:', this.contactData);
      form.resetForm();
      return;
    }

    this.http.post(this.endPoint, this.contactData, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).subscribe({
      next: (res: string) => {
        console.log('Server sagt:', res);
        form.resetForm();
      },
      error: (err) => {
        console.error('Fehler beim Senden:', err);
      }
    });
  }
}