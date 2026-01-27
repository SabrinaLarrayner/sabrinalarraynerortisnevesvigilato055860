import { Routes } from '@angular/router';
import { ListPets } from './pages/list-pets/list-pets';
import { LayoutDefaut } from './layout/layout-defaut/layout-defaut';

export const routes: Routes = [
  {
    path: '', 
    // component: LayoutDefaut,
    children: [
      {
        path: 'list-pets',
        component: ListPets 
      },
      {
        path: '', 
        redirectTo: 'list-pets', 
        pathMatch: 'full' 
      }
    ]
  }

];