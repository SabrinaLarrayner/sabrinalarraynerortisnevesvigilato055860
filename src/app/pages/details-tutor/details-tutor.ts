import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, map, Observable } from 'rxjs';
import { Card } from '../../components/card/card';
import { Button } from '../../components/button/button';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { tutorAndPet } from '../../service/tutors-and-pets/tutors-and-pet.facade';
import { PetFacade } from '../../service/pet/pet.facade';
import { FormatPipe } from '../../utils/regex/regex';

@Component({
  selector: 'app-details-tutor',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, Card, Button, FormsModule, FormatPipe],
  templateUrl: './details-tutor.html',
})
export class DetailsTutor implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public facade = inject(TutorFacade);
  public petFacade = inject(PetFacade);
  private tutorPetFacade = inject(tutorAndPet);

  private destroy$ = new Subject<void>();

  showDeleteModal = false;
  showLinkPetModal = false;
  showUnlinkModal = false;

  selectedPetId: number | null = null;
  petToUnlink: any = null;
  tutorId!: number;

  searchTerm: string = '';

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

  get filteredPets$(): Observable<any[]> {
    return this.petFacade.pets$.pipe(
      map((pets: any[]) => {
        if (!this.searchTerm) return pets;         
        const term = this.searchTerm.toLowerCase();
        return pets.filter((pet: any) => 
          pet.nome.toLowerCase().includes(term)
        );
      })
    );
  }

  openLinkModal(): void {
    this.petFacade.getAll();
    this.selectedPetId = null;
    this.searchTerm = '';
    this.showLinkPetModal = true;
  }

  confirmLink(): void {
    if (this.selectedPetId && this.tutorId) {
      this.tutorPetFacade.linkPet(this.tutorId, this.selectedPetId).subscribe({
        next: () => {
          this.showLinkPetModal = false;
          this.facade.getById(this.tutorId);
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

  goEditTutor(id: number): void {
    this.router.navigate(['/details-tutor', id, 'edit']);
  }

  goPetId(id: number): void {
    this.router.navigate(['/details-pet', id]);
  }

  back(): void {
    this.router.navigate(['/list-tutors']);
  }

  toggleDeleteModal(show: boolean): void {
    this.showDeleteModal = show;
  }

  confirmDelete(): void {
    if (this.tutorId) {
      this.facade.delete(this.tutorId);
      this.toggleDeleteModal(false);
      this.back();
    }
  }
}