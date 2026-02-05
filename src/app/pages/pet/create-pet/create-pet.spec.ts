import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePet } from './create-pet';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { PetFacade } from '@services/pet/pet.facade';

describe('CLEA (Vitest)', () => {
  let component: CreatePet;
  let fixture: ComponentFixture<CreatePet>;
  let router: Router;

  const mockPetFacade = {
    createWithPhoto: vi.fn().mockReturnValue(of({ success: true })),
    loading$: of(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePet,NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideEnvironmentNgxMask(),
        { provide: PetFacade, useValue: mockPetFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePet);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    vi.clearAllMocks();
    fixture.detectChanges();
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título "Cadastrar Pet"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Cadastrar Pet');
  });

  it('não deve submeter se o formulário for inválido', () => {
    component.onSubmit();
    expect(mockPetFacade.createWithPhoto).not.toHaveBeenCalled();
  });

  it('deve submeter com sucesso quando o formulário for válido', () => {
    const file = new File([''], 'pet.png', { type: 'image/png' });

    component.form.patchValue({
      nome: 'Rex',
      idade: 2,
      raca: 'Labrador',
      photo: file
    });

    component.onSubmit();

    expect(mockPetFacade.createWithPhoto).toHaveBeenCalled();
  });

  it('deve ajustar o label da idade corretamente', () => {
    component.form.patchValue({ idade: 1 });
    expect(component.getYearsLabel()).toBe('Idade (ano)');

    component.form.patchValue({ idade: 2 });
    expect(component.getYearsLabel()).toBe('Idade (anos)');
  });

  it('deve processar a seleção de imagem', () => {
    const file = new File([''], 'dog.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(component.form.get('photo')?.value).toBe(file);
  });

  it('deve remover a foto corretamente', () => {
    const file = new File([''], 'foto.png', { type: 'image/png' });

    component.form.get('photo')?.setValue(file);
    component.photoPreview = 'data:image/png;base64,test';

    component.removePhoto();

    expect(component.form.get('photo')?.value).toBeNull();
    expect(component.photoPreview).toBeNull();
  });

  it('deve navegar para /list-pets após submit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const file = new File([''], 'pet.png', { type: 'image/png' });

    component.form.patchValue({
      nome: 'Bolota',
      idade: 3,
      raca: 'Poodle',
      photo: file
    });

    component.onSubmit();

    expect(mockPetFacade.createWithPhoto).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Bolota',
        idade: 3,
        raca: 'Poodle'
      }),
      file
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/list-pets']);
  });

  it('deve navegar para /list-pets ao cancelar', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.cancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/list-pets']);
  });
});
