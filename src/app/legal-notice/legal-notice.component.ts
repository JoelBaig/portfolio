import { Component } from '@angular/core';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [
    PrivacyPolicyComponent
  ],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

openPrivacyPolicy() {
    window.open('/privacy-policy', '_blank');
  }
}