import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as cpfValidator from '../../utils/cpf-validator/cpf-validator';
import { EditTutor } from './edit-tutor';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { IdDeletPhotoTutor } from '../../service/tutor/id-delete-photo-tutor';
import { IdPhotoTutor } from '../../service/tutor/id-photo-tutor';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { provideNgxMask } from 'ngx-mask';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

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
    vi.spyOn(cpfValidator, 'validateCpf').mockReturnValue(() => null);

    await TestBed.configureTestingModule({
      imports: [EditTutor],
      providers: [
        provideNgxMask(),
        provideNoopAnimations(),
        { provide: TutorFacade, useValue: mockTutorFacade },
        { provide: IdDeletPhotoTutor, useValue: { deletePhoto: vi.fn().mockReturnValue(of({})) } },
        { provide: IdPhotoTutor, useValue: { uploadPhoto: vi.fn().mockReturnValue(of({})) } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        },
        { provide: Router, useValue: { navigate: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTutor);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('deve invalidar o formulário se o CPF for inválido', async () => {
    vi.spyOn(cpfValidator, 'validateCpf').mockReturnValue(() => ({
      cpfInvalido: true
    }));

    fixture = TestBed.createComponent(EditTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const cpfControl = component.form.get('cpf');
    cpfControl?.setValue('111.111.111-11');

    await fixture.whenStable();

    expect(cpfControl?.hasError('cpfInvalido')).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('deve validar o formulário quando um CPF correto for inserido', async () => {
    component.form.get('cpf')?.setValue('359.916.440-12');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.form.get('cpf')?.errors).toBeNull();
  });

  it('deve preencher o formulário com máscaras ao receber dados do tutor', async () => {
    tutorSelected$.next(tutorMock);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.form.value.cpf).toBe('359.916.440-12');
  });

  it('deve chamar o update com dados limpos ao salvar', async () => {
    tutorSelected$.next(tutorMock);
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({ nome: 'Nome Editado' });
    component.onSubmit();

    expect(mockTutorFacade.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        cpf: '35991644012'
      })
    );
  });
});
