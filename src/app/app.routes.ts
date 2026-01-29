import { Routes } from '@angular/router';
import { ListPets } from './pages/list-pets/list-pets';
import { LayoutDefaut } from './layout/layout-defaut/layout-defaut';
import { Login } from './pages/login/login';
import { CreatePet } from './pages/create-pet/create-pet';
import { DetailsPet } from './pages/details-pet/details-pet';
import { EditPet } from './pages/edit-pet/edit-pet';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    children: [
      {
        path: 'list-pets',
        component: ListPets
      },
      {
        path: 'create-pet',
        component: CreatePet
      },
      {
        path: 'details-pet/:id',
        component: DetailsPet
      },
      {
        path: 'details-pet/:id/edit',
        component: EditPet
      },
      {
        path: '',
        redirectTo: 'list-pets',
        pathMatch: 'full'
      }
    ]
  }

];
