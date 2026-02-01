import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Adicione para o async pipe
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';

import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { LayoutToggleView } from '../../layout/layout-toggle-view/layout-toggle-view';
import { PetFacade } from '../../service/pet/pet.facade';

@Component({
  selector: 'app-list-pets',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatPaginatorModule, 
    ReactiveFormsModule, 
    InputField, 
    Button, 
    Card, 
    LayoutToggleView
  ],
  templateUrl: './list-pets.html',
})
export class ListPets implements OnInit, OnDestroy {
  public facade = inject(PetFacade); // public para o HTML
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  
  currentPage = 0;
  pageSize = 10;
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadPets();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadPets();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.facade.clearState();
  }

  loadPets(): void {
    const search = this.searchControl.value || '';
    this.facade.listAll(this.currentPage, this.pageSize, search);
  }

  handlePageEvent(e: PageEvent): void {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadPets();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToCreate(): void {
    this.router.navigate(['/create-pet']);
  }

  detailsPet(id: number): void {
    this.router.navigate(['/details-pet', id]);
  }

  yearsPlural(age: number): string {
    return age > 1 ? 'anos' : 'ano';
  }
}