import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent
    },
    {
        path: 'project/:id',
        loadComponent: () =>
            import('./project-details/project-details.component')
                .then(m => m.ProjectDetailsComponent)
    },
];
