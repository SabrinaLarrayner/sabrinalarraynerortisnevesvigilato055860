import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Card } from 'src/app/components/card/card';
import { Button } from 'src/app/components/button/button';
import { PetFacade } from 'src/app/service/pet/pet.facade';

@Component({
  selector: 'app-details-pet',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button, Card],
  templateUrl: './details-pet.html',
})
export class DetailsPet implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public facade = inject(PetFacade);
  
  public showDeleteModal = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.facade.getById(id);
    } else {
      this.back();
    }
  }

  ngOnDestroy(): void {
    this.facade.clearState();
  }

  back(): void {
    this.router.navigate(['/list-pets']);
  }

  goEdit(id: number): void {
    this.router.navigate(['/details-pet', id, 'edit']);
  }

  toggleDeleteModal(show: boolean): void {
    this.showDeleteModal = show;
  }
  
  goToTutorDetails(id: number): void {
    this.router.navigate(['/details-tutor', id]);
  }

  confirmDelete(id: number): void {
    if (!id) return;
    this.facade.delete(id).subscribe({
      next: () => {
        this.toggleDeleteModal(false);
        this.back();
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao excluir o pet.');
      }
    });
  }

  getYearsLabel(age: number): string {
    return age > 1 ? 'anos' : 'ano';
  }
}