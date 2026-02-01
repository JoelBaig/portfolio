import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./main-page/main-page.component').then(m => m.MainPageComponent),
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./legal-notice/legal-notice.component').then(m => m.LegalNoticeComponent),
  },
  {
    path: 'project/:id',
    loadComponent: () =>
      import('./project-details/project-details.component').then(m => m.ProjectDetailsComponent),
  },
];