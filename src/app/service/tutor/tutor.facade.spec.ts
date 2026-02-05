import { TestBed } from '@angular/core/testing';
import { TutorFacade } from './tutor.facade';
import { IdTutor } from './id-tutor';
import { TutorsListService } from './tutors-list';
import { IdPhotoTutorsService } from './id-photo-tutors';
import { CreateTutorService } from './create-tutors';
import { DeleteTutor } from './delete-tutor';
import { EditTutorService } from './edit-tutor';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('TutorFacade', () => {
  let facade: TutorFacade;
  let idServiceMock: any;
  let listServiceMock: any;
  let createServiceMock: any;
  let photoServiceMock: any;
  let deleteServiceMock: any;
  let editServiceMock: any;

  beforeEach(() => {
    idServiceMock = { execute: vi.fn() };
    listServiceMock = { execute: vi.fn() };
    createServiceMock = { execute: vi.fn() };
    photoServiceMock = { uploadPhoto: vi.fn() };
    deleteServiceMock = { execute: vi.fn() };
    editServiceMock = { update: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        TutorFacade,
        { provide: IdTutor, useValue: idServiceMock },
        { provide: TutorsListService, useValue: listServiceMock },
        { provide: CreateTutorService, useValue: createServiceMock },
        { provide: IdPhotoTutorsService, useValue: photoServiceMock },
        { provide: DeleteTutor, useValue: deleteServiceMock },
        { provide: EditTutorService, useValue: editServiceMock },
      ]
    });

    facade = TestBed.inject(TutorFacade);
  });

  it('deve ser criado corretamente', () => {
    expect(facade).toBeTruthy();
  });

  describe('listAll', () => {
    it('deve atualizar tutorsList$ e gerenciar o loading', () => {
      const mockRes = { content: [{ id: 1, nome: 'Sabrina' }], totalElements: 1 };
      listServiceMock.execute.mockReturnValue(of(mockRes));

      facade.listAll(0, 10);

      facade.tutorsList$.subscribe(res => {
        expect(res).toEqual(mockRes);
      });
      facade.loading$.subscribe(loading => expect(loading).toBe(false));
    });
  });

  describe('createWithPhoto', () => {
    it('deve criar tutor e depois fazer upload da foto, atualizando a lista ao final', () => {
      const mockTutor = { id: 123, nome: 'Novo Tutor' };
      const mockFile = new File([''], 'avatar.png');
      const mockPhotoRes = { url: 'api.com/photo.png' };

      createServiceMock.execute.mockReturnValue(of(mockTutor));
      photoServiceMock.uploadPhoto.mockReturnValue(of(mockPhotoRes));
      listServiceMock.execute.mockReturnValue(of({ content: [] }));

      facade.createWithPhoto(mockTutor as any, mockFile).subscribe(res => {
        expect(res).toEqual(mockPhotoRes);
        expect(createServiceMock.execute).toHaveBeenCalled();
        expect(photoServiceMock.uploadPhoto).toHaveBeenCalledWith(123, mockFile);
        expect(listServiceMock.execute).toHaveBeenCalled();
      });
    });
  });

  describe('update', () => {
    it('deve atualizar o tutor selecionado e recarregar a lista', () => {
      const updatedTutor = { id: 1, nome: 'Sabrina Vigilato' };
      editServiceMock.update.mockReturnValue(of(updatedTutor));
      listServiceMock.execute.mockReturnValue(of({ content: [updatedTutor] }));

      facade.update(1, updatedTutor as any).subscribe();

      facade.tutorSelected$.subscribe(tutor => {
        expect(tutor).toEqual(updatedTutor);
      });
      expect(listServiceMock.execute).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve chamar o delete e disparar listAll em caso de sucesso', () => {
      deleteServiceMock.execute.mockReturnValue(of(undefined));
      listServiceMock.execute.mockReturnValue(of({ content: [] }));

      facade.delete(1);

      expect(deleteServiceMock.execute).toHaveBeenCalledWith(1);
      expect(listServiceMock.execute).toHaveBeenCalled();
    });

    it('deve desativar o loading em caso de erro na exclusão', () => {
      deleteServiceMock.execute.mockReturnValue(throwError(() => new Error('Erro')));

      facade.delete(1);

      facade.loading$.subscribe(loading => expect(loading).toBe(false));
    });
  });

  it('deve limpar o estado ao chamar clearState', () => {
    facade.clearState();
    facade.tutorSelected$.subscribe(res => expect(res).toBeNull());
    facade.tutorsList$.subscribe(res => expect(res).toBeNull());
  });
});
