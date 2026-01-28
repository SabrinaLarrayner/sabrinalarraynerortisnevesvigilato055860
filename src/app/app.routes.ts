import { Routes } from '@angular/router';
import { ListPets } from './pages/list-pets/list-pets';
import { LayoutDefaut } from './layout/layout-defaut/layout-defaut';
import { Login } from './pages/login/login';
import { CreatePet } from './pages/create-pet/create-pet';

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
        path: '',
        redirectTo: 'list-pets',
        pathMatch: 'full'
      }
    ]
  }

];
