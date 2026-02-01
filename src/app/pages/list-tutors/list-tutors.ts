import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';

import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { LayoutToggleView } from '../../layout/layout-toggle-view/layout-toggle-view';
import { TutorFacade } from '../../service/tutor/tutor.facade';

@Component({
  selector: 'app-list-tutors',
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
  templateUrl: './list-tutors.html',
})
export class ListTutors implements OnInit, OnDestroy {
  private facade = inject(TutorFacade);
  private router = inject(Router);

  tutorsList$ = this.facade.tutorsList$;
  loading$ = this.facade.loading$;

  private destroy$ = new Subject<void>();

  currentPage = 0;
  pageSize = 10;
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadTutors();
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadTutors();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.facade.clearState();
  }

  loadTutors(): void {
    const name = this.searchControl.value?.trim() || '';
    this.facade.listAll(this.currentPage, this.pageSize, name);
  }

  handlePageEvent(e: PageEvent): void {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadTutors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToCreate(): void {
    this.router.navigate(['/create-tutor']);
  }

  public detailsTutors(id: number): void {
    this.router.navigate(['/details-tutor', id]);
  }
}