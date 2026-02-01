import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { IdDeletPhotoTutor } from '../../service/tutor/id-delete-photo-tutor';
import { IdPhotoTutor } from '../../service/tutor/id-photo-tutor';


@Component({
  selector: 'app-edit-tutor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, InputField, Button],
  templateUrl: './edit-tutor.html',
})
export class EditTutor implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private deletePhotoService = inject(IdDeletPhotoTutor);
  private uploadPhotoService = inject(IdPhotoTutor);
  public facade = inject(TutorFacade);

  form!: FormGroup;
  tutorId!: number;
  showDeleteImgModal = false;

  ngOnInit(): void {
    this.tutorId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.applyMasks();

    if (this.tutorId) {
      this.facade.getById(this.tutorId);

      this.facade.tutorSelected$.subscribe(tutor => {
        if (tutor) {
          const formattedTutor = {
            ...tutor,
            cpf: this.formatCPF(String(tutor.cpf)),
            telefone: this.formatTelefone(tutor.telefone)
          };

          this.form.reset(formattedTutor);

          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        }
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      cpf: [null, [Validators.required]]
    });
  }

  // --- LÓGICA DE FOTOS (UPLOAD E DELETE) ---

  triggerFileInput(input: HTMLInputElement): void {
    input.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.tutorId) {
      this.uploadPhotoService.uploadPhoto(this.tutorId, file).subscribe({
        next: () => {
          this.facade.getById(this.tutorId); // Atualiza a foto na tela
        },
        error: (err) => console.error('Erro ao fazer upload:', err)
      });
    }
  }

  confirmDeleteImage(fotoId: number): void {
    this.deletePhotoService.deletePhoto(this.tutorId, fotoId).subscribe({
      next: () => {
        this.showDeleteImgModal = false;
        this.facade.getById(this.tutorId); // Atualiza para remover a foto da tela
      },
      error: (err) => console.error('Erro ao deletar foto:', err)
    });
  }

  // --- MÁSCARAS ---

  private applyMasks(): void {
    this.form.get('cpf')?.valueChanges.subscribe(value => {
      if (value) {
        const masked = this.formatCPF(value);
        this.form.get('cpf')?.setValue(masked, { emitEvent: false });
      }
    });

    this.form.get('telefone')?.valueChanges.subscribe(value => {
      if (value) {
        const masked = this.formatTelefone(value);
        this.form.get('telefone')?.setValue(masked, { emitEvent: false });
      }
    });
  }

  private formatCPF(value: string): string {
    const numbers = value.replace(/\D/g, '').substring(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.substring(0, 3)}.${numbers.substring(3)}`;
    if (numbers.length <= 9) return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6)}`;
    return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9, 11)}`;
  }

  private formatTelefone(value: string): string {
    const numbers = value.replace(/\D/g, '').substring(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
  }

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  // --- NAVEGAÇÃO E SUBMIT ---

  onSubmit(): void {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        cpf: this.form.value.cpf.replace(/\D/g, ''), // Enviando como string limpa
        telefone: this.form.value.telefone.replace(/\D/g, '')
      };

      this.facade.update(this.tutorId, payload).subscribe({
        next: () => this.router.navigate(['/details-tutor', this.tutorId]),
        error: (err) => console.error('Erro ao atualizar:', err)
      });
    }
  }

  back(): void {
    this.router.navigate(['/details-tutor', this.tutorId]);
  }
}