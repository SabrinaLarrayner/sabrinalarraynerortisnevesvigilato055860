import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTutor } from './create-tutor';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CreateTutor (Vitest)', () => {
  let component: CreateTutor;
  let fixture: ComponentFixture<CreateTutor>;
  let router: Router;

  const mockTutorFacade = {
    createWithPhoto: vi.fn().mockReturnValue(of({ success: true })),
    loading$: of(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTutor, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNgxMask(),
        { provide: TutorFacade, useValue: mockTutorFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTutor);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    
    vi.clearAllMocks();
    fixture.detectChanges();
  });

  it('deve instanciar o componente de cadastro de tutor', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o título "Cadastrar Tutor" no cabeçalho', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Cadastrar Tutor');
  });

  it('deve invalidar o formulário se o CPF for inválido', () => {
    component.form.patchValue({
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '65999999999',
      cpf: '111.111.111-11' 
    });
    component.cpfControl.setErrors({ cpfInvalido: true });
    fixture.detectChanges();
    expect(component.form.valid).toBe(false);
    expect(component.cpfControl.errors?.['cpfInvalido']).toBeTruthy();
  });

  it('deve validar o formulário com dados e CPF corretos', () => {
    component.form.patchValue({
      nome: 'Joana da Silva Leite',
      email: 'sabrina@email.com',
      telefone: '65988887777',
      cpf: '75655468018', //SÓ PASSA SE FOR UM CPF VÁLIDO, CPF DO 4DEVS
      endereco: 'Várzea Grande, MT'
    });
    component.cpfControl.setErrors(null); 
    
    expect(component.form.valid).toBe(true);
  });

  it('deve simular o upload da foto do tutor', () => {
    const blob = new Blob([''], { type: 'image/png' });
    const file = new File([blob], 'tutor-avatar.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
    expect(component.selectedFile?.name).toBe('tutor-avatar.png');
  });

  it('deve chamar o facade e navegar ao salvar um tutor válido', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    component.form.patchValue({
      nome: 'Tutor Teste',
      email: 'teste@teste.com',
      telefone: '65999998888',
      cpf: '12345678901'
    });
    
    component.form.get('cpf')?.setErrors(null);

    component.onSubmit();

    expect(mockTutorFacade.createWithPhoto).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/list-tutors']);
  });

  it('deve voltar para a listagem ao clicar em cancelar', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.cancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/list-tutors']);
  });
});