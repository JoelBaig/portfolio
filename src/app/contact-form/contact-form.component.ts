// import { Component, inject, EventEmitter, Output } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { NgClass, NgIf, } from '@angular/common';
// import { AppHeadlineComponent } from '../app-headline/app-headline.component';
// import { AppBtnComponent } from '../app-btn/app-btn.component';
// import { FooterComponent } from '../shared/footer/footer.component';

// @Component({
//   selector: 'app-contact-form',
//   standalone: true,
//   imports: [
//     FormsModule,
//     NgClass,
//     NgIf,
//     AppHeadlineComponent,
//     AppBtnComponent,
//     FooterComponent,
//   ],
//   templateUrl: './contact-form.component.html',
//   styleUrl: './contact-form.component.scss'
// })
// export class ContactFormComponent {
//   private http = inject(HttpClient);

//   @Output() legalNoticeClick = new EventEmitter<void>();

//   onLegalNoticeClick() {
//     this.legalNoticeClick.emit();
//   }

//   contactData = {
//     contactName: '',
//     email: '',
//     message: '',
//   };

//   namePlaceholder = 'Your name goes here';
//   emailPlaceholder = 'youremail@email.com';
//   messagePlaceholder = 'Ask me here...';

//   accepted = false;
//   hovered = false;
//   submitted = false;
//   sending = false;

//   endPoint = 'https://joelbaig.com/sendMail.php';

//   submitForm(contactForm: NgForm) {
//     this.submitted = true;
//     contactForm.form.markAllAsTouched();
//     this.onSubmit(contactForm);
//   }

//   onSubmit(contactForm: NgForm) {
//     this.submitted = true;
//     contactForm.form.markAllAsTouched();

//     if (this.sending || !this.accepted || contactForm.invalid) return;

//     this.sending = true;

//     this.http.post(this.endPoint, this.contactData, {
//       headers: { 'Content-Type': 'application/json' },
//       responseType: 'text'
//     }).subscribe({
//       next: (res: string) => {
//         this.sending = false;
//         contactForm.resetForm();
//         this.submitted = false;
//         this.accepted = false;
//         this.hovered = false;
//         this.namePlaceholder = 'Your name goes here';
//         this.emailPlaceholder = 'youremail@email.com';
//         this.messagePlaceholder = 'Ask me here...';
//       },
//       error: (err) => {
//         this.sending = false;
//       }
//     });
//   }

//   toggleCheckbox(event: Event) {
//     event.preventDefault();
//     this.accepted = !this.accepted;
//   }
// }

import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    AppHeadlineComponent,
    AppBtnComponent,
    FooterComponent,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private http = inject(HttpClient);

  @Output() legalNoticeClick = new EventEmitter<void>();
  onLegalNoticeClick() { this.legalNoticeClick.emit(); }

  contactData = {
    contactName: '',
    email: '',
    message: '',
  };

  namePlaceholder = 'Your name goes here';
  emailPlaceholder = 'youremail@email.com';
  messagePlaceholder = 'Ask me here...';

  accepted = false;
  hovered = false;
  submitted = false;
  sending = false;

  // ✅ Toast State
  sendStatus: 'idle' | 'success' | 'error' = 'idle';
  toastVisible = false;

  endPoint = 'https://joelbaig.com/sendMail.php';

  onSubmit(contactForm: NgForm) {
    this.submitted = true;
    contactForm.form.markAllAsTouched();
    this.sendStatus = 'idle';

    if (this.sending || !this.accepted || contactForm.invalid) return;
    this.sending = true;

    this.http.post(this.endPoint, this.contactData, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.sending = false;
        this.showToast('success');
        contactForm.resetForm();
        this.submitted = false;
        this.accepted = false;
        this.hovered = false;
        this.namePlaceholder = 'Your name goes here';
        this.emailPlaceholder = 'youremail@email.com';
        this.messagePlaceholder = 'Ask me here...';
      },
      error: () => {
        this.sending = false;
        this.showToast('error');
      }
    });
  }

  private showToast(status: 'success' | 'error', duration = 3000) {
    this.sendStatus = status;
    this.toastVisible = true;

    this.toastVisibleTimeout(duration);
    this.toastInactiveTimeout(duration);
  }

  toastVisibleTimeout(duration: number) {
    setTimeout(() => {
      this.toastVisible = false;
    }, duration);
  }

  toastInactiveTimeout(duration: number) {
    setTimeout(() => {
      this.sendStatus = 'idle';
    }, duration + 300);
  }


  toggleCheckbox(event: Event) {
    event.preventDefault();
    this.accepted = !this.accepted;
  }
}