import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { PetFacade } from 'src/app/service/pet/pet.facade';
import { LayoutToggleView } from 'src/app/layout/layout-toggle-view/layout-toggle-view';
import { Card } from 'src/app/components/card/card';
import { Button } from 'src/app/components/button/button';
import { InputField } from 'src/app/components/input-field/input-field';

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
  public facade = inject(PetFacade);
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