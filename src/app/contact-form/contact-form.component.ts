import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { AppBtnComponent } from '../app-btn/app-btn.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    FormsModule,
    AppHeadlineComponent,
    NgClass,
    AppBtnComponent,
    NgIf
  ],
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

  namePlaceholder = 'Your name goes here';
  emailPlaceholder = 'youremail@email.com';
  messagePlaceholder = 'Ask me here...';

  accepted = false;
  hovered = false;

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

  toggleCheckbox(event: Event) {
    event.preventDefault(); // Verhindert unnötige Nebeneffekte
    this.accepted = !this.accepted;
  }

}