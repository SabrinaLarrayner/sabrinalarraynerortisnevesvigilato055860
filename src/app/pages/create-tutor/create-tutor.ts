import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Card } from '../../components/card/card';
import { Button } from '../../components/button/button';
import { InputField } from '../../components/input-field/input-field';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { validateCpf } from '../../utils/cpf-validator/cpf-validator';

@Component({
  selector: 'app-create-tutor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, Card, Button, InputField, /* NgxMaskDirective */],
  providers: [provideNgxMask()],
  templateUrl: './create-tutor.html',
})
export class CreateTutor {
  private fb = inject(FormBuilder); 
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public facade = inject(TutorFacade);

  photoPreview: string | null = null;
  selectedFile: File | null = null;

  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    endereco: [''],
    cpf: [null, [Validators.required, validateCpf()]],
  });

  get nomeControl() { return this.form.get('nome') as FormControl; }
  get emailControl() { return this.form.get('email') as FormControl; }
  get telefoneControl() { return this.form.get('telefone') as FormControl; }
  get enderecoControl() { return this.form.get('endereco') as FormControl; }
  get cpfControl() { return this.form.get('cpf') as FormControl; }

  onFileSelected(event: any): void {
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

  removePhoto(): void {
    this.photoPreview = null;
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.facade.createWithPhoto(this.form.value, this.selectedFile).subscribe({
        next: () => this.router.navigate(['/list-tutors']),
        error: (err) => console.error('Error during tutor registration:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/list-tutors']);
  }
}
