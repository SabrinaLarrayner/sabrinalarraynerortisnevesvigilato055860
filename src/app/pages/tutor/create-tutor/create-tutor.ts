import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { provideNgxMask } from 'ngx-mask';
import { Card } from 'src/app/components/card/card';
import { Button } from 'src/app/components/button/button';
import { InputField } from 'src/app/components/input-field/input-field';
import { TutorFacade } from 'src/app/service/tutor/tutor.facade';
import { validateCpf } from 'src/app/utils/cpf-validator/cpf-validator';

@Component({
  selector: 'app-create-tutor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    Card,
    Button,
    InputField
  ],
  providers: [provideNgxMask()],
  templateUrl: './create-tutor.html',
})
export class CreateTutor {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public facade = inject(TutorFacade);

  photoPreview: string | null = null;

  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    endereco: [''],
    cpf: [null, [Validators.required, validateCpf()]],
    photo: [null, Validators.required]
  });

  get nomeControl(): FormControl {
    return this.form.get('nome') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get telefoneControl(): FormControl {
    return this.form.get('telefone') as FormControl;
  }

  get enderecoControl(): FormControl {
    return this.form.get('endereco') as FormControl;
  }

  get cpfControl(): FormControl {
    return this.form.get('cpf') as FormControl;
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

  onSubmit(): void {
    if (!this.form.valid) {
      console.warn('form inválido');
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.getRawValue();
    const photoFile: File = formValue.photo;
    this.facade.createWithPhoto(formValue, photoFile).subscribe({
      next: () => this.router.navigate(['/list-tutors']),
      error: (err) => console.error('Error during tutor registration:', err)
    });
  }

  cancel(): void {
    this.router.navigate(['/list-tutors']);
  }
}
