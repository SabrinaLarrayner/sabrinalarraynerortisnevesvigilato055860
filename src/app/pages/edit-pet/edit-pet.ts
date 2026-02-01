import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PetFacade } from '../../service/pet/pet.facade';
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
  private cdr = inject(ChangeDetectorRef);
  public facade = inject(PetFacade);

  public editForm: FormGroup;
  public petId!: number;
  public showDeleteImgModal = false;

  constructor() {
    this.editForm = this.fb.group({
      nome: ['', [Validators.required]],
      raca: ['', [Validators.required]],
      idade: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.petId = Number(idParam);
      this.initData();
    } else {
      this.back();
    }
  }

  initData(): void {
    this.facade.getById(this.petId);
    this.facade.petSelected$.subscribe(pet => {
      if (pet) {
        this.editForm.reset({
          nome: pet.nome,
          raca: pet.raca,
          idade: pet.idade
        });
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  getControl(name: string): FormControl {
    return this.editForm.get(name) as FormControl;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.facade.uploadPhoto(this.petId, file).subscribe();
    }
  }

  confirmDeleteImage(fotoId: number): void {
    this.facade.deletePhoto(this.petId, fotoId).subscribe({
      next: () => this.showDeleteImgModal = false
    });
  }

  save(): void {
    if (this.editForm.valid) {
      this.facade.update(this.petId, this.editForm.value).subscribe({
        next: () => this.router.navigate(['/details-pet', this.petId]),
        error: () => alert('Erro ao atualizar pet.')
      });
    }
  }

  back(): void {
    this.router.navigate(['/details-pet', this.petId]);
  }
  
  triggerFileInput(input: HTMLInputElement, event: Event): void {
    event.preventDefault();
    input.click();
  }
}