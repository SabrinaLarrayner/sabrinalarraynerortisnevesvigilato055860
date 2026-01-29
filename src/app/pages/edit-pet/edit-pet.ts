import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { IdPet } from '../../service/id-pet';
import { PetEdit } from '../../service/pet-edit';
import { PetDeleteImg } from '../../service/pet-delete-img';
import { IdPhotoPets } from '../../service/id-photo-pets'; // Importado
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { InputField } from '../../components/input-field/input-field';

@Component({
  selector: 'app-edit-pet',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, Button, Card, InputField],
  templateUrl: './edit-pet.html',
})
export class EditPet implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private idPetService = inject(IdPet);
  private petEditService = inject(PetEdit);
  private petDeleteImgService = inject(PetDeleteImg);
  private idPhotoPetsService = inject(IdPhotoPets); // Injetado
  private cdr = inject(ChangeDetectorRef);

  public editForm: FormGroup;
  public loading = true;
  public petId!: number;
  public fotoId?: number;
  public fotoUrl?: string;
  public showDeleteImgModal = false;

  constructor() {
    this.editForm = this.fb.group({
      nome: ['', [Validators.required]],
      raca: ['', [Validators.required]],
      idade: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.petId = Number(idParam);
      this.data();
    } else {
      this.back();
    }
  }

  data(): void {
    this.loading = true;
    this.idPetService.execute(this.petId).subscribe({
      next: (pet) => {
        this.fotoUrl = pet.foto?.url;
        this.fotoId = pet.foto?.id;
        this.editForm.patchValue({
          nome: pet.nome,
          raca: pet.raca,
          idade: pet.idade
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.back()
    });
  }

  // --- Lógica de Troca de Imagem (Upload) ---
  triggerFileInput(fileInput: HTMLInputElement, event: Event): void {
    event.preventDefault(); // Evita submit do form
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.petId) {
      this.loading = true;
      this.idPhotoPetsService.execute(this.petId, file).subscribe({
        next: (res) => {
          this.fotoUrl = res.url;
          this.fotoId = res.id;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro no upload:', err);
          this.loading = false;
          alert('Erro ao carregar nova imagem.');
          this.cdr.detectChanges();
        }
      });
    }
  }

  // --- Lógica de Exclusão de Imagem (Modal) ---
  openDeleteImgModal(event: Event): void {
    event.preventDefault();
    this.showDeleteImgModal = true;
  }

  closeDeleteImgModal(): void {
    this.showDeleteImgModal = false;
  }

  confirmDeleteImage(): void {
    if (this.petId && this.fotoId) {
      this.loading = true;
      this.showDeleteImgModal = false;
      this.petDeleteImgService.execute(this.petId, this.fotoId).subscribe({
        next: () => {
          this.fotoUrl = undefined;
          this.fotoId = undefined;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao excluir imagem:', err);
          this.loading = false;
          this.cdr.detectChanges();
          alert('Erro ao excluir imagem.');
        }
      });
    }
  }

  save(): void {
    if (this.editForm.valid) {
      this.loading = true;
      this.petEditService.execute(this.petId, this.editForm.value).subscribe({
        next: () => {
          this.router.navigate(['/details-pet', this.petId]);
        },
        error: (err) => {
          console.error('Erro na atualização:', err);
          this.loading = false;
          alert('Erro ao atualizar pet. Verifique sua sessão.');
          this.cdr.detectChanges();
        }
      });
    }
  }

  back(): void {
    this.router.navigate(['/details-pet', this.petId]);
  }
}