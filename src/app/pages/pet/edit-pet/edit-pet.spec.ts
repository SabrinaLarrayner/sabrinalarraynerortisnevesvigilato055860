import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPet } from './edit-pet';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { provideNgxMask } from 'ngx-mask';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PetFacade } from '@services/pet/pet.facade';

describe('EditPet', () => {
  let component: EditPet;
  let fixture: ComponentFixture<EditPet>;
  let router: Router;

  const petMock = {
    id: 2,
    nome: 'Bolt',
    raca: 'Vira-lata',
    idade: 3,
    foto: { id: 10, url: 'img.jpg' }
  };

  const petSelected$ = new BehaviorSubject<any>(null);

  const mockPetFacade = {
    getById: vi.fn(),
    update: vi.fn().mockReturnValue(of({})),
    uploadPhoto: vi.fn().mockReturnValue(of({})),
    deletePhoto: vi.fn().mockReturnValue(of({})),
    petSelected$: petSelected$.asObservable(),
    loading$: of(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPet],
      providers: [
        provideNgxMask(),
        provideNoopAnimations(),
        { provide: PetFacade, useValue: mockPetFacade },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '2' : null)
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPet);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar o pet pelo id ao iniciar', () => {
    expect(mockPetFacade.getById).toHaveBeenCalledWith(2);
  });

  it('deve preencher o formulário quando o pet for carregado', () => {
    petSelected$.next(petMock);

    expect(component.editForm.value).toEqual({
      nome: 'Bolt',
      raca: 'Vira-lata',
      idade: 3
    });
  });

  it('deve salvar e navegar para detalhes do pet', () => {
    component.editForm.setValue({
      nome: 'Novo Nome',
      raca: 'Nova Raça',
      idade: 5
    });
    component.save();
    expect(mockPetFacade.update).toHaveBeenCalledWith(2, {
      nome: 'Novo Nome',
      raca: 'Nova Raça',
      idade: 5
    });
    expect(router.navigate).toHaveBeenCalledWith(['/details-pet', 2]);
  });

  it('deve voltar para a tela de detalhes ao clicar em voltar', () => {
    component.back();
    expect(router.navigate).toHaveBeenCalledWith(['/details-pet', 2]);
  });

  it('deve fazer upload da imagem', () => {
    const file = new File([''], 'pet.png');
    component.onFileSelected({
      target: { files: [file] }
    });
    expect(mockPetFacade.uploadPhoto).toHaveBeenCalledWith(2, file);
  });

  it('deve excluir a imagem e fechar o modal', () => {
    component.showDeleteImgModal = true;
    component.confirmDeleteImage(10);
    expect(mockPetFacade.deletePhoto).toHaveBeenCalledWith(2, 10);
    expect(component.showDeleteImgModal).toBe(false);
  });
});