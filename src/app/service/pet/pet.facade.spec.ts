import { TestBed } from '@angular/core/testing';
import { PetsService } from './pets';
import { IdPhotoPets } from './id-photo-pets';
import { IdPet } from './id-pet';
import { IdPetDelete } from './id-pet-delete';
import { PetEdit } from './pet-edit';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PetDeleteImg } from './pet-delete-img';
import { PetFacade } from '../../service/pet/pet.facade';
import { CreatePets } from './create-pets';
describe('PetFacade', () => {
  let facade: PetFacade;
  let petsServiceMock: any;
  let idPetServiceMock: any;
  let createServiceMock: any;
  let photoServiceMock: any;
  let deleteServiceMock: any;
  let editServiceMock: any;
  let deleteImgServiceMock: any;

  beforeEach(() => {
    petsServiceMock = { listAll: vi.fn() };
    idPetServiceMock = { execute: vi.fn() };
    createServiceMock = { execute: vi.fn() };
    photoServiceMock = { execute: vi.fn() };
    deleteServiceMock = { execute: vi.fn() };
    editServiceMock = { execute: vi.fn() };
    deleteImgServiceMock = { execute: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        PetFacade,
        { provide: PetsService, useValue: petsServiceMock },
        { provide: CreatePets, useValue: createServiceMock },
        { provide: IdPhotoPets, useValue: photoServiceMock },
        { provide: IdPet, useValue: idPetServiceMock },
        { provide: IdPetDelete, useValue: deleteServiceMock },
        { provide: PetEdit, useValue: editServiceMock },
        { provide: PetDeleteImg, useValue: deleteImgServiceMock },
      ]
    });

    facade = TestBed.inject(PetFacade);
  });

  it('deve ser criado', () => {
    expect(facade).toBeTruthy();
  });

  describe('listAll', () => {
    it('deve atualizar petsList$ e loading$ ao listar com sucesso', () => {
      const mockRes = { content: [{ id: 1, nome: 'Rex' }], totalElements: 1 };
      petsServiceMock.listAll.mockReturnValue(of(mockRes));
      facade.listAll(0, 10);
      facade.pets$.subscribe(pets => {
        expect(pets).toEqual(mockRes.content);
      });
      facade.loading$.subscribe(loading => {
        expect(loading).toBe(false);
      });
    });

    it('deve tentar buscar por raça se a busca por termo (nome) retornar vazio', () => {
      const emptyRes = { content: [] };
      const breedRes = { content: [{ id: 2, nome: 'Poodle' }] };

      petsServiceMock.listAll
        .mockReturnValueOnce(of(emptyRes))
        .mockReturnValueOnce(of(breedRes));

      facade.listAll(0, 10, 'Poodle');

      facade.pets$.subscribe(pets => {
        expect(pets).toEqual(breedRes.content);
      });
      expect(petsServiceMock.listAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('getById', () => {
    it('deve atualizar petSelected$ ao buscar por ID', () => {
      const mockPet = { id: 1, nome: 'Rex' };
      idPetServiceMock.execute.mockReturnValue(of(mockPet));

      facade.getById(1);

      facade.petSelected$.subscribe(pet => {
        expect(pet).toEqual(mockPet);
      });
    });
  });

  describe('createWithPhoto', () => {
    it('deve criar pet e fazer upload da foto sequencialmente', () => {
      const mockPet = { id: 10, nome: 'Novo Pet' };
      const mockFile = new File([''], 'dog.jpg');
      const mockPetWithPhoto = { ...mockPet, foto: { url: 'img.jpg' } };

      createServiceMock.execute.mockReturnValue(of(mockPet));
      photoServiceMock.execute.mockReturnValue(of(mockPetWithPhoto));

      facade.createWithPhoto(mockPet, mockFile).subscribe(res => {
        expect(res).toEqual(mockPetWithPhoto);
        expect(photoServiceMock.execute).toHaveBeenCalledWith(10, mockFile);
      });
    });
  });

  describe('deletePhoto', () => {
    it('deve remover a foto do pet selecionado no estado após deletar com sucesso', () => {
      const initialPet = { id: 1, nome: 'Rex', foto: { id: 99 } };
      facade['petSelectedSubject'].next(initialPet);
      deleteImgServiceMock.execute.mockReturnValue(of(undefined));
      facade.deletePhoto(1, 99).subscribe();
      facade.petSelected$.subscribe(pet => {
        expect(pet.foto).toBeNull();
      });
    });
  });
  it('deve limpar o estado ao chamar clearState', () => {
    facade.clearState();

    facade.pets$.subscribe(pets => expect(pets).toEqual([]));
    facade.petSelected$.subscribe(selected => expect(selected).toBeNull());
    facade.loading$.subscribe(loading => expect(loading).toBe(false));
  });
});