import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { LayoutToggleView } from '../../layout/layout-toggle-view/layout-toggle-view';
import { PetResponse, PetsService } from '../../service/pets';

@Component({
  selector: 'app-list-pets',
  standalone: true,
  imports: [
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
  private petService = inject(PetsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  
  private destroy$ = new Subject<void>();
  
  pets: PetResponse[] = [];   
  totalPets: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.dataPets();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.dataPets();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navigateToCreate(): void {
    this.router.navigate(['/create-pet']);
  }

  public detailsPet(id: number): void {
    this.router.navigate(['/details-pet', id]);
  }

  dataPets(): void {
    const search = this.searchControl.value?.trim() || '';
    this.petService.listAll(this.currentPage, this.pageSize, search)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dados: any) => {
          if (search !== '' && (!dados.content || dados.content.length === 0)) {
            this.fetchByRaca(search);
          } else {
            this.renderPets(dados);
          }
        },
        error: (err) => console.error('Erro na busca:', err)
      });
  }

  private fetchByRaca(search: string): void {
    this.petService.listAll(this.currentPage, this.pageSize, undefined, search)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dados: any) => this.renderPets(dados),
        error: (err) => console.error('Erro na busca por raça:', err)
      });
  }

  private renderPets(dados: any): void {
    this.pets = dados?.content || [];  
    this.totalPets = dados?.total || 0; 
    this.cdr.detectChanges();
  }

  yearsPlural(idade: number): string {
    return idade > 1 ? 'anos' : 'ano';
  }

  handlePageEvent(e: PageEvent): void {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.dataPets();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}