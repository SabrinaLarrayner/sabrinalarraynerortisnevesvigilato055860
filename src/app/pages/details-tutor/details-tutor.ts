import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; // Adicionado para o [(ngModel)]
import { Subject, takeUntil } from 'rxjs';
import { Card } from '../../components/card/card';
import { Button } from '../../components/button/button';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { tutorAndPet } from '../../service/tutors-and-pets/tutors-and-pet.facade';
import { PetFacade } from '../../service/pet/pet.facade';

@Component({
  selector: 'app-details-tutor',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, Card, Button, FormsModule],
  templateUrl: './details-tutor.html',
})
export class DetailsTutor implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public facade = inject(TutorFacade);
  public petFacade = inject(PetFacade);
  private tutorPetFacade = inject(tutorAndPet);
  
  private destroy$ = new Subject<void>();

  // Estados dos Modais
  showDeleteModal = false;
  showLinkPetModal = false;
  showUnlinkModal = false;

  // Auxiliares de Vínculo
  selectedPetId: number | null = null;
  petToUnlink: any = null;
  tutorId!: number;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.tutorId = Number(params.get('id'));
      if (this.tutorId) {
        this.facade.getById(this.tutorId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.facade.clearState();
  }

  // --- LÓGICA DE VÍNCULO (NOVO) ---

  openLinkModal(): void {
    // this.petFacade.getAll(); // Carrega lista de pets para o select
    this.selectedPetId = null;
    this.showLinkPetModal = true;
  }

  confirmLink(): void {
    if (this.selectedPetId && this.tutorId) {
      this.tutorPetFacade.linkPet(this.tutorId, this.selectedPetId).subscribe({
        next: () => {
          this.showLinkPetModal = false;
          this.facade.getById(this.tutorId); // Recarrega tutor e sua lista de pets
        },
        error: (err) => console.error('Erro ao vincular:', err)
      });
    }
  }

  openUnlinkModal(pet: any): void {
    this.petToUnlink = pet;
    this.showUnlinkModal = true;
  }

  confirmUnlink(): void {
    if (this.petToUnlink && this.tutorId) {
      this.tutorPetFacade.unlinkPet(this.tutorId, this.petToUnlink.id).subscribe({
        next: () => {
          this.showUnlinkModal = false;
          this.facade.getById(this.tutorId);
        },
        error: (err) => console.error('Erro ao desvincular:', err)
      });
    }
  }

  // --- MÉTODOS EXISTENTES ---

  goEditTutor(id: number): void {
    this.router.navigate(['/edit-tutor', id]); // Ajustado para sua rota de edição
  }

  formatPhone(phone: string | undefined): string {
    if (!phone) return 'Não informado';
    const value = phone.replace(/\D/g, '');
    if (value.length === 11) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  }

  back(): void {
    this.router.navigate(['/list-tutors']);
  }

  toggleDeleteModal(show: boolean): void {
    this.showDeleteModal = show;
  }

  confirmDelete(id: number): void {
    this.facade.delete(id);
    this.toggleDeleteModal(false);
    this.back(); 
  }
}