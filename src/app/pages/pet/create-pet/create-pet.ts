import { Component, inject, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Button } from 'src/app/components/button/button';
import { InputField } from 'src/app/components/input-field/input-field';
import { Card } from 'src/app/components/card/card';
import { PetFacade } from 'src/app/service/pet/pet.facade';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    Button,
    InputField,
    Card
  ],
  templateUrl: './create-pet.html',
})
export class CreatePet {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  public facade = inject(PetFacade);

  photoPreview: string | null = null;

  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    idade: [null, [Validators.required, Validators.min(0)]],
    raca: ['', [Validators.required]],
    photo: [null, Validators.required]
  });

  get nomeControl(): FormControl {
    return this.form.get('nome') as FormControl;
  }

  get idadeControl(): FormControl {
    return this.form.get('idade') as FormControl;
  }

  get racaControl(): FormControl {
    return this.form.get('raca') as FormControl;
  }

  get photoControl(): FormControl {
    return this.form.get('photo') as FormControl;
  }

  onFileSelected(event: any): void {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;
    this.photoControl.setValue(file);
    this.photoControl.markAsTouched();
    this.photoControl.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoPreview = null;

    this.photoControl.setValue(null);
    this.photoControl.markAsTouched();
    this.photoControl.updateValueAndValidity();
  }

  // Submit
  onSubmit(): void {
    console.log('submit acionado');

    if (!this.form.valid) {
      console.warn('form inválido');
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const photoFile: File = formValue.photo;

    this.facade.createWithPhoto(formValue, photoFile).subscribe({
      next: () => this.router.navigate(['/list-pets']),
      error: (err) => console.error('Error creating pet:', err)
    });
  }

  getYearsLabel(): string {
    const value = this.idadeControl.value;
    return value > 1 ? 'Idade (anos)' : 'Idade (ano)';
  }

  cancel(): void {
    this.router.navigate(['/list-pets']);
  }
}
