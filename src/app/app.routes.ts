import { Routes } from '@angular/router';
import { authGuard } from './service/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'list-pets',
        loadComponent: () => import('./pages/list-pets/list-pets').then(m => m.ListPets)
      },
      {
        path: 'create-pet',
        loadComponent: () => import('./pages/create-pet/create-pet').then(m => m.CreatePet)
      },
      {
        path: 'details-pet/:id',
        loadComponent: () => import('./pages/details-pet/details-pet').then(m => m.DetailsPet)
      },
      {
        path: 'details-pet/:id/edit',
        loadComponent: () => import('./pages/edit-pet/edit-pet').then(m => m.EditPet)
      },
      {
        path: 'list-tutors',
        loadComponent: () => import('./pages/list-tutors/list-tutors').then(m => m.ListTutors)
      },
      {
        path: 'create-tutor',
        loadComponent: () => import('./pages/create-tutor/create-tutor').then(m => m.CreateTutor)
      },
      {
        path: 'details-tutor/:id',
        loadComponent: () => import('./pages/details-tutor/details-tutor').then(m => m.DetailsTutor)
      },
      {
        path: 'details-tutor/:id/edit',
        loadComponent: () => import('./pages/edit-tutor/edit-tutor').then(m => m.EditTutor)
      },
      {
        path: '',
        redirectTo: 'list-pets',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];