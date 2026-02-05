import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTutor } from './edit-tutor';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { provideNgxMask } from 'ngx-mask';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TutorFacade } from '@services/tutor/tutor.facade';
import { IdDeletPhotoTutor } from '@services/tutor/id-delete-photo-tutor';
import { IdPhotoTutor } from '@services/tutor/id-photo-tutor';

vi.mock('../../utils/cpf-validator/cpf-validator', () => ({
  validateCpf: vi.fn()
}));

describe('EditTutor', () => {
  let component: EditTutor;
  let fixture: ComponentFixture<EditTutor>;
  let router: Router;

  const tutorMock = {
    id: 1,
    nome: 'Joana',
    email: 'joana@teste.com',
    telefone: '65999999999',
    cpf: '35991644012',
    endereco: 'Rua Exemplo',
    foto: { id: 50, url: 'img.jpg' }
  };

  const tutorSelected$ = new BehaviorSubject<any>(null);

  const mockTutorFacade = {
    getById: vi.fn(),
    update: vi.fn().mockReturnValue(of({})),
    tutorSelected$: tutorSelected$.asObservable(),
    loading$: of(false)
  };
  beforeEach(async () => {
    tutorSelected$.next(null);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [EditTutor],
      providers: [
        provideNgxMask(),
        provideNoopAnimations(),
        { provide: TutorFacade, useValue: mockTutorFacade },
        { provide: IdDeletPhotoTutor, useValue: { deletePhoto: vi.fn(() => of({})) } },
        { provide: IdPhotoTutor, useValue: { uploadPhoto: vi.fn(() => of({})) } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        },
        { provide: Router, useValue: { navigate: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTutor);
    component = fixture.componentInstance;
    component.form.get('cpf')?.setValidators([]); 
    component.form.get('cpf')?.updateValueAndValidity();

    router = TestBed.inject(Router);
    fixture.detectChanges();
  });
  it('deve invalidar o formulário se o CPF for inválido', async () => {
    const cpfControl = component.form.get('cpf');
    cpfControl?.setValidators([() => ({ cpfInvalido: true })]);
    cpfControl?.setValue('111.111.111-11');
    cpfControl?.updateValueAndValidity();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(cpfControl?.hasError('cpfInvalido')).toBe(true);
    expect(component.form.invalid).toBe(true);
  });
  it('deve validar o formulário quando um CPF correto for inserido', async () => {
    const cpfControl = component.form.get('cpf');
    cpfControl?.setValidators([() => null]);
    cpfControl?.setValue('359.916.440-12');
    cpfControl?.updateValueAndValidity();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(cpfControl?.errors).toBeNull();
  });

  it('deve preencher o formulário com máscaras ao receber dados do tutor', async () => {
    tutorSelected$.next(tutorMock);
    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(component.form.get('cpf')?.value).toBe('359.916.440-12');
    expect(component.form.get('telefone')?.value).toBe('(65) 99999-9999');
  });

  it('deve chamar o update com dados limpos ao salvar', async () => {
    tutorSelected$.next(tutorMock);
    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();

    component.form.patchValue({ nome: 'Nome Editado' });
    component.onSubmit();

    expect(mockTutorFacade.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        cpf: '35991644012',
        telefone: '65999999999',
        nome: 'Nome Editado'
      })
    );
  });
});