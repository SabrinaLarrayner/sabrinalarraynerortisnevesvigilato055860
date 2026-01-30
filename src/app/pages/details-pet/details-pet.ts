import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { IdPet, PetDetailResponse } from '../../service/id-pet';
import { IdPetDelete } from '../../service/id-pet-delete'; 
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';

@Component({
  selector: 'app-details-pet',
  standalone: true,
  imports: [CommonModule, MatIconModule, Button, Card],
  templateUrl: './details-pet.html',
})
export class DetailsPet implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private idPetService = inject(IdPet);
  private idPetDeleteService = inject(IdPetDelete); 
  private cdr = inject(ChangeDetectorRef);

  public pet?: PetDetailResponse;
  public loading = true;
  public showDeleteModal = false; 

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id) {
      this.getPetDetails(id);
    } else {
      this.back();
    }
  }

  private getPetDetails(id: number): void {
    this.loading = true;
    this.idPetService.execute(id).subscribe({
      next: (data) => {
        this.pet = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  back(): void {
    this.router.navigate(['/list-pets']);
  }

  showModalDelete(): void {
    this.showDeleteModal = true;
  }

  goEdit(): void {
    if (this.pet?.id) {
      this.router.navigate(['/details-pet', this.pet.id, 'edit']);
    }
  }

  fecharModalExclusao(): void {
    this.showDeleteModal = false;
  }

  yearsPlural(): string {
    const valor = this.pet?.idade ?? 0;
    return valor > 1 ? 'anos' : 'ano';
  }

  deletePet(): void {
    if (this.pet && this.pet.id) {
      this.loading = true; 
      this.showDeleteModal = false;

      this.idPetDeleteService.execute(this.pet.id).subscribe({
        next: () => {
          this.back();
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          this.loading = false;
          this.cdr.detectChanges();
          alert('Erro ao excluir o pet. Verifique se o ID está correto ou se você tem permissão.');
        }
      });
    }
  }
}