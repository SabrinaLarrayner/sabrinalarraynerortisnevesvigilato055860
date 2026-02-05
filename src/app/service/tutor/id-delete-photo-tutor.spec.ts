import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IdDeletPhotoTutor } from './id-delete-photo-tutor';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('IdDeletPhotoTutor', () => {
  let service: IdDeletPhotoTutor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IdDeletPhotoTutor]
    });

    service = TestBed.inject(IdDeletPhotoTutor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar o endpoint de deleção de foto com os IDs corretos via DELETE', () => {
    const tutorId = 5;
    const fotoId = 10;

    service.deletePhoto(tutorId, fotoId).subscribe((response) => {
      expect(response).toBeNull();
    });
    const expectedUrl = `${environment.api_url}/tutores/${tutorId}/fotos/${fotoId}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deve lidar com erro ao tentar deletar uma foto inexistente (404)', () => {
    const tutorId = 1;
    const fotoId = 999;

    service.deletePhoto(tutorId, fotoId).subscribe({
      next: () => fail('A requisição deveria ter falhado com 404'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const expectedUrl = `${environment.api_url}/tutores/${tutorId}/fotos/${fotoId}`;
    const req = httpMock.expectOne(expectedUrl);
    req.flush('Foto não encontrada', { status: 404, statusText: 'Not Found' });
  });
});
