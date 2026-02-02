import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { Button } from '../../components/button/button';
import { InputField } from '../../components/input-field/input-field';
import { Card } from '../../components/card/card';
import { PetFacade } from '../../service/pet/pet.facade';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, Button, InputField, Card],
  templateUrl: './create-pet.html',
})
export class CreatePet {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  public facade = inject(PetFacade);

  selectedFile: File | null = null;
  photoPreview: string | null = null;

  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    idade: [null, [Validators.required, Validators.min(0)]], 
    raca: ['', [Validators.required]],
  });

  get nomeControl(): FormControl { return this.form.get('nome') as FormControl; }
  get idadeControl(): FormControl { return this.form.get('idade') as FormControl; }
  get racaControl(): FormControl { return this.form.get('raca') as FormControl; }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.selectedFile = null;
    this.photoPreview = null;
  } 

  onSubmit() {
    if (this.form.valid) {
      this.facade.createWithPhoto(this.form.value, this.selectedFile).subscribe({
        next: () => this.router.navigate(['/list-pets']),
        error: (err) => console.error('Error creating pet:', err)
      });
    }
  }

  getYearsLabel(): string {
    const value = this.form.get('idade')?.value;
    return value > 1 ? 'Idade (anos)' : 'Idade (ano)';
  }
  
  cancel(): void {
    this.router.navigate(['/list-pets']);
  }
}