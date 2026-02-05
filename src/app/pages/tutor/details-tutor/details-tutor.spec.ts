import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsTutor } from './details-tutor';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { PetFacade } from '../../service/pet/pet.facade';
import { tutorAndPet } from '../../service/tutors-and-pets/tutors-and-pet.facade';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DetailsTutor', () => {
  let component: DetailsTutor;
  let fixture: ComponentFixture<DetailsTutor>;

  const tutorMock = {
    id: 1,
    nome: 'João',
    email: 'joao@email.com',
    telefone: '6599999999',
    endereco: 'Cuiabá',
    foto: { url: '' },
    pets: []
  };
  
  const tutorSubject = new BehaviorSubject(tutorMock);

  const mockTutorFacade = {
    getById: vi.fn(),
    clearState: vi.fn(),
    delete: vi.fn(),
    loading$: of(false),
    tutorSelected$: tutorSubject.asObservable()
  };

  const mockPetFacade = {
    pets$: of([{ id: 10, nome: 'Thor', raca: 'Golden', idade: 3 }]),
    getAll: vi.fn()
  };

  const mockTutorPetFacade = {
    linkPet: vi.fn(() => of(null)),
    unlinkPet: vi.fn(() => of(null))
  };

  const routerMock = {
    navigate: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsTutor, NoopAnimationsModule],
      providers: [
        { provide: TutorFacade, useValue: mockTutorFacade },
        { provide: PetFacade, useValue: mockPetFacade },
        { provide: tutorAndPet, useValue: mockTutorPetFacade },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o tutor pelo ID da rota', () => {
    expect(mockTutorFacade.getById).toHaveBeenCalledWith(1);
  });

  it('deve navegar para lista de tutores ao clicar em voltar', () => {
    component.back();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/list-tutors']);
  });

  it('deve navegar para edição do tutor', () => {
    component.goEditTutor(1);
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/details-tutor',
      1,
      'edit'
    ]);
  });

  it('deve abrir o modal de exclusão', () => {
    component.toggleDeleteModal(true);
    expect(component.showDeleteModal).toBe(true);
  });

  it('deve excluir tutor e voltar para lista', () => {
    component.confirmDelete();
    expect(mockTutorFacade.delete).toHaveBeenCalledWith(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/list-tutors']);
  });

  it('deve abrir modal de vincular pet e carregar pets', () => {
    component.openLinkModal();
    expect(mockPetFacade.getAll).toHaveBeenCalled();
    expect(component.showLinkPetModal).toBe(true);
  });

  it('deve vincular pet ao tutor', () => {
    component.selectedPetId = 10;
    component.confirmLink();

    expect(mockTutorPetFacade.linkPet).toHaveBeenCalledWith(1, 10);
    expect(mockTutorFacade.getById).toHaveBeenCalledWith(1);
  });

  it('deve abrir modal de desvincular pet', () => {
    const pet = { id: 10, nome: 'Thor' };
    component.openUnlinkModal(pet);
    expect(component.showUnlinkModal).toBe(true);
    expect(component.petToUnlink).toEqual(pet);
  });

  it('deve desvincular pet do tutor', () => {
    component.petToUnlink = { id: 10 };
    component.confirmUnlink();

    expect(mockTutorPetFacade.unlinkPet).toHaveBeenCalledWith(1, 10);
    expect(mockTutorFacade.getById).toHaveBeenCalledWith(1);
  });

  it('deve limpar estado ao destruir o componente', () => {
    component.ngOnDestroy();
    expect(mockTutorFacade.clearState).toHaveBeenCalled();
  });
});
