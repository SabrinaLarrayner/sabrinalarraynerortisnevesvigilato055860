import { ComponentFixture, TestBed} from '@angular/core/testing';
import { CreateTutor } from './create-tutor'; // Import correto
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TutorFacade } from '../../service/tutor/tutor.facade';
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
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CreateTutor);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('deve instanciar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve invalidar o formulário se a foto não for selecionada', () => {
    component.form.patchValue({
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '65999999999',
      cpf: '75655468018'
    });
    expect(component.form.valid).toBe(false);
    expect(component.photoControl.errors?.['required']).toBeTruthy();
  });

  it('deve processar upload da foto e atualizar o preview', async () => {
    const readerInstanceMock = {
      readAsDataURL: vi.fn(),
      result: 'data:image/png;base64,FAKE_BASE64',
      onload: null as any
    };
    const MockFileReader = function() {
      return readerInstanceMock;
    };
    vi.stubGlobal('FileReader', MockFileReader);
    const file = new File([''], 'tutor-avatar.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as any;
    component.onFileSelected(event);
    expect(component.photoControl.value).toBe(file);
    if (readerInstanceMock.onload) {
      readerInstanceMock.onload();
    }
    fixture.detectChanges();
    expect(component.photoPreview).toBe('data:image/png;base64,FAKE_BASE64');
    vi.unstubAllGlobals();
  });
  it('deve chamar o facade quando o formulário estiver válido', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const file = new File([''], 'foto.png', { type: 'image/png' });
    component.form.patchValue({
      nome: 'Tutor Teste',
      email: 'teste@teste.com',
      telefone: '65999998888',
      cpf: '75655468018',
      photo: file
    });
    component.form.updateValueAndValidity();
    component.onSubmit();
    expect(mockTutorFacade.createWithPhoto).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/list-tutors']);
  });

  it('deve navegar para /list-tutors ao clicar em cancelar', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.cancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/list-tutors']);
  });
});