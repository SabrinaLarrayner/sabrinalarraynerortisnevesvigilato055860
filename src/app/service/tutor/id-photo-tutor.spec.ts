import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IdPhotoTutor, photoResponse } from './id-photo-tutor';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('IdPhotoTutor', () => {
  let service: IdPhotoTutor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IdPhotoTutor]
    });

    service = TestBed.inject(IdPhotoTutor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o upload da foto do tutor enviando FormData via POST', () => {
    const tutorId = 7;
    const mockFile = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
    
    const mockResponse: photoResponse = {
      id: 100,
      nome: 'avatar.png',
      contentType: 'image/png',
      url: 'http://api.com/tutores/fotos/100'
    };

    service.uploadPhoto(tutorId, mockFile).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.id).toBe(100);
    });
    const expectedUrl = `${environment.api_url}/tutores/${tutorId}/fotos`;
    const req = httpMock.expectOne(expectedUrl);
    
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    expect(req.request.body.has('foto')).toBe(true);
    expect(req.request.body.get('foto')).toEqual(mockFile);
    req.flush(mockResponse);
  });

  it('deve lidar com erro 415 (Unsupported Media Type) caso o arquivo seja inválido', () => {
    const tutorId = 1;
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

    service.uploadPhoto(tutorId, invalidFile).subscribe({
      next: () => fail('A requisição deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(415);
      }
    });

    const expectedUrl = `${environment.api_url}/tutores/${tutorId}/fotos`;
    const req = httpMock.expectOne(expectedUrl);
    req.flush('Unsupported Media Type', { status: 415, statusText: 'Unsupported Media Type' });
  });
});