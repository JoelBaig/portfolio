import { Component, inject, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeadlineComponent } from '../app-headline/app-headline.component';
import { AppBtnComponent } from '../app-btn/app-btn.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Handles the contact form, including validation,
 * form submission, reset behavior and toast feedback.
 */
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    RouterModule,
    AppHeadlineComponent,
    AppBtnComponent,
    FooterComponent,
    TranslateModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements AfterViewInit {
  private http = inject(HttpClient);
  private readonly contactRestoreKey = 'restoreContactInstantly';

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

  /**
   * Restores the contact section after returning from legal notice.
   */
  ngAfterViewInit(): void {
    this.restoreContactViewIfNeeded();
  }

  /**
   * Returns the correct form endpoint depending on the current hostname.
   *
   * @returns The endpoint URL used for the contact form request.
   */
  private get endPoint(): string {
    return this.isLocalhost()
      ? 'https://joelbaig.com/sendMail.php'
      : '/sendMail.php';
  }

  /**
   * Checks whether the application is currently running on localhost.
   *
   * @returns True if the current hostname is localhost.
   */
  private isLocalhost(): boolean {
    return window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
  }

  /**
   * Emits an event to open or show the legal notice section.
   */
  onLegalNoticeClick(): void {
    this.legalNoticeClick.emit();
  }

  /**
   * Prepares, validates and submits the contact form.
   *
   * @param contactForm The Angular form instance.
   */
  onSubmit(contactForm: NgForm): void {
    this.prepareSubmit(contactForm);

    if (this.isSubmitBlocked(contactForm)) return;

    this.sendContactForm(contactForm);
  }

  /**
   * Marks the form as submitted and resets the current send status.
   *
   * @param contactForm The Angular form instance.
   */
  private prepareSubmit(contactForm: NgForm): void {
    this.submitted = true;
    contactForm.form.markAllAsTouched();
    this.sendStatus = 'idle';
  }

  /**
   * Checks whether the form submission should be blocked.
   *
   * @param contactForm The Angular form instance.
   * @returns True if the form should not be submitted.
   */
  private isSubmitBlocked(contactForm: NgForm): boolean {
    return this.sending ||
      !this.accepted ||
      contactForm.form.invalid;
  }

  /**
   * Sends the contact form data to the configured endpoint.
   *
   * @param contactForm The Angular form instance.
   */
  private sendContactForm(contactForm: NgForm): void {
    this.sending = true;

    this.http.post(this.endPoint, this.contactData, this.getHttpOptions())
      .subscribe({
        next: (res) => this.handleSubmitSuccess(res, contactForm),
        error: (err) => this.handleSubmitError(err)
      });
  }

  /**
   * Returns the HTTP options used for the contact form request.
   *
   * @returns The HTTP headers and response type configuration.
   */
  private getHttpOptions() {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text' as const
    };
  }

  /**
   * Handles a successful form submission.
   *
   * @param res The server response text.
   * @param contactForm The Angular form instance.
   */
  private handleSubmitSuccess(res: string, contactForm: NgForm): void {
    console.log('SUCCESS RESPONSE:', res);
    this.sending = false;
    this.showToast('success');
    this.resetContactForm(contactForm);
  }

  /**
   * Handles a failed form submission.
   *
   * @param err The error response.
   */
  private handleSubmitError(err: any): void {
    console.error('ERROR RESPONSE:', err);
    console.error('SERVER ERROR:', err?.error);
    this.sending = false;
    this.showToast('error');
  }

  /**
   * Resets the form fields, form data and local submission state.
   *
   * @param contactForm The Angular form instance.
   */
  private resetContactForm(contactForm: NgForm): void {
    contactForm.resetForm();
    this.resetContactData();
    this.resetSubmitState();
  }

  /**
   * Resets the contact form data model.
   */
  private resetContactData(): void {
    this.contactData = {
      contactName: '',
      email: '',
      message: '',
      website: ''
    };
  }

  /**
   * Resets all local submission-related state values.
   */
  private resetSubmitState(): void {
    this.submitted = false;
    this.accepted = false;
    this.hovered = false;
  }

  /**
   * Displays a toast message for the given status.
   *
   * @param status The toast status to show.
   * @param duration The duration in milliseconds before the toast disappears.
   */
  private showToast(status: 'success' | 'error', duration = 3000): void {
    this.sendStatus = status;
    this.toastVisible = false;
    this.showToastAnimated();
    this.hideToastAfter(duration);
    this.resetToastStatusAfter(duration);
  }

  /**
   * Makes the toast visible on the next animation frame.
   */
  private showToastAnimated(): void {
    requestAnimationFrame(() => {
      this.toastVisible = true;
    });
  }

  /**
   * Hides the toast after the provided duration.
   *
   * @param duration The delay in milliseconds.
   */
  private hideToastAfter(duration: number): void {
    setTimeout(() => {
      this.toastVisible = false;
    }, duration);
  }

  /**
   * Resets the toast status back to idle after the animation delay.
   *
   * @param duration The base toast duration in milliseconds.
   */
  private resetToastStatusAfter(duration: number): void {
    setTimeout(() => {
      this.sendStatus = 'idle';
    }, duration + 300);
  }

  /**
   * Toggles the custom checkbox state and prevents default browser behavior.
   *
   * @param event The checkbox click event.
   */
  toggleCheckbox(event: Event): void {
    event.preventDefault();
    this.accepted = !this.accepted;
  }

  /**
   * Restores the contact section if requested.
   */
  private restoreContactViewIfNeeded(): void {
    if (!this.shouldRestoreContactView()) return;

    this.clearContactRestoreRequest();
    this.restoreContactViewRepeatedly();
  }

  /**
   * Checks whether the contact section should be restored.
   *
   * @returns True if the contact section should be restored.
   */
  private shouldRestoreContactView(): boolean {
    return sessionStorage.getItem(this.contactRestoreKey) === 'true';
  }

  /**
   * Clears the stored contact restore request.
   */
  private clearContactRestoreRequest(): void {
    sessionStorage.removeItem(this.contactRestoreKey);
  }

  /**
   * Restores the contact position multiple times to override later jumps.
   */
  private restoreContactViewRepeatedly(): void {
    this.restoreContactViewInstantly();
    requestAnimationFrame(() => this.restoreContactViewInstantly());
    setTimeout(() => this.restoreContactViewInstantly(), 0);
    setTimeout(() => this.restoreContactViewInstantly(), 50);
  }

  /**
   * Restores the contact section without smooth scrolling.
   */
  private restoreContactViewInstantly(): void {
    const top = this.getContactTopPosition();
    this.forceInstantScroll(top);
  }

  /**
   * Returns the absolute top position of the contact section.
   *
   * @returns The contact section top offset.
   */
  private getContactTopPosition(): number {
    const contact = document.getElementById('contact');
    return contact ? contact.getBoundingClientRect().top + window.scrollY : 0;
  }

  /**
   * Scrolls to the given top position without smooth behavior.
   *
   * @param top The target top position.
   */
  private forceInstantScroll(top: number): void {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, top);
    html.style.scrollBehavior = previousBehavior;
  }
}