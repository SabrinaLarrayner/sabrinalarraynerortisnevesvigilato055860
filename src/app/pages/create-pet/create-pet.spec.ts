import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePet } from './create-pet';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { PetFacade } from '../../service/pet/pet.facade';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CreatePet (Vitest)', () => {
  let component: CreatePet;
  let fixture: ComponentFixture<CreatePet>;
  let router: Router;

  const mockPetFacade = {
    createWithPhoto: vi.fn().mockReturnValue(of({ success: true })),
    loading$: of(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePet, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNgxMask(),
        { provide: PetFacade, useValue: mockPetFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePet);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    
    vi.clearAllMocks();
    localStorage.clear();
    
    fixture.detectChanges();
  });

  it('deve instanciar o componente corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('deve verificar se o título "Cadastrar Pet" está presente no HTML', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Cadastrar Pet');
  });

  it('deve submeter o formulário com sucesso quando os dados forem válidos', () => {
    component.form.patchValue({
      nome: 'Rex',
      idade: 2,
      raca: 'Labrador'
    });

    component.onSubmit();

    expect(mockPetFacade.createWithPhoto).toHaveBeenCalled();
  });

  it('deve mudar a label da idade para plural/singular (anos/ano)', () => {
    component.form.patchValue({ idade: 2 });
    expect(component.getYearsLabel()).toBe('Idade (anos)');

    component.form.patchValue({ idade: 1 });
    expect(component.getYearsLabel()).toBe('Idade (ano)');
  });

  it('deve processar a seleção de uma imagem fake', () => {
    const blob = new Blob([''], { type: 'image/png' });
    const file = new File([blob], 'dog-seplag.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
    expect(component.selectedFile?.name).toBe('dog-seplag.png');
  });

  it('deve limpar as variáveis de imagem ao clicar em "Excluir"', () => {
    component.selectedFile = new File([''], 'foto-velha.png');
    component.photoPreview = 'data:image/png;base64,sample';

    component.removePhoto();

    expect(component.selectedFile).toBeNull();
    expect(component.photoPreview).toBeNull();
  });

  it('deve submeter o formulário com o nome "Bolota" e navegar para listagem', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const file = new File([''], 'pet.png', { type: 'image/png' });
    
    component.selectedFile = file;
    component.form.patchValue({
      nome: 'Bolota', 
      idade: 3,
      raca: 'Poodle'
    });

    component.onSubmit();

    expect(mockPetFacade.createWithPhoto).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Bolota' }),
      file
    );
    
    expect(navigateSpy).toHaveBeenCalledWith(['/list-pets']);
  });

  it('deve navegar de volta para /list-pets ao cancelar', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.cancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/list-pets']);
  });
});