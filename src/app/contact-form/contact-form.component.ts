import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private http = inject(HttpClient);

  @Output() legalNoticeClick = new EventEmitter<void>();

  contactData = {
    contactName: '',
    email: '',
    message: '',
    website: ''
  };

  accepted = false;
  hovered = false;
  submitted = false;
  sending = false;

  sendStatus: 'idle' | 'success' | 'error' = 'idle';
  toastVisible = false;

  private get endPoint(): string {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    return isLocalhost
      ? 'https://joelbaig.com/sendMail.php'
      : '/sendMail.php';
  }

  onLegalNoticeClick() {
    this.legalNoticeClick.emit();
  }

  onSubmit(contactForm: NgForm) {
    this.submitted = true;
    contactForm.form.markAllAsTouched();
    this.sendStatus = 'idle';

    if (
      this.sending ||
      !this.accepted ||
      contactForm.invalid
    ) {
      return;
    }

    this.sending = true;

    this.http.post(
      this.endPoint,
      this.contactData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'text'
      }
    ).subscribe({
      next: (res) => {
        console.log('SUCCESS RESPONSE:', res);

        this.sending = false;
        this.showToast('success');

        contactForm.resetForm();

        this.contactData = {
          contactName: '',
          email: '',
          message: '',
          website: ''
        };

        this.submitted = false;
        this.accepted = false;
        this.hovered = false;
      },

      error: (err) => {
        console.error('ERROR RESPONSE:', err);
        console.error('SERVER ERROR:', err?.error);

        this.sending = false;
        this.showToast('error');
      }
    });
  }

  private showToast(
    status: 'success' | 'error',
    duration = 3000
  ) {
    this.sendStatus = status;
    this.toastVisible = false;

    requestAnimationFrame(() => {
      this.toastVisible = true;
    });

    setTimeout(() => {
      this.toastVisible = false;
    }, duration);

    setTimeout(() => {
      this.sendStatus = 'idle';
    }, duration + 300);
  }

  toggleCheckbox(event: Event) {
    event.preventDefault();
    this.accepted = !this.accepted;
  }
}