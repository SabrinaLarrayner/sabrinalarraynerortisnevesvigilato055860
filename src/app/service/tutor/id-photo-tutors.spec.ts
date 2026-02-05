import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IdPhotoTutorsService, PhotoResponse } from './id-photo-tutors';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('IdPhotoTutorsService', () => {
  let service: IdPhotoTutorsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IdPhotoTutorsService]
    });

    service = TestBed.inject(IdPhotoTutorsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o upload da foto do tutor enviando FormData via POST', () => {
    const tutorId = 15;
    const mockFile = new File(['conteudo-da-imagem'], 'profile.jpg', { type: 'image/jpeg' });
    
    const mockResponse: PhotoResponse = {
      id: 500,
      nome: 'profile.jpg',
      contentType: 'image/jpeg',
      url: 'http://api.com/tutores/fotos/500'
    };

    service.uploadPhoto(tutorId, mockFile).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.url).toBe(mockResponse.url);
    });

    const expectedUrl = `${environment.api_url}/tutores/${tutorId}/fotos`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    expect(req.request.body.has('foto')).toBe(true);
    expect(req.request.body.get('foto')).toEqual(mockFile);

    req.flush(mockResponse);
  });

  it('deve lidar com erro 400 (Bad Request) se o upload falhar', () => {
    const tutorId = 1;
    const mockFile = new File([''], 'erro.png');

    service.uploadPhoto(tutorId, mockFile).subscribe({
      next: () => fail('A requisição deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const expectedUrl = `${environment.api_url}/tutores/${tutorId}/fotos`;
    const req = httpMock.expectOne(expectedUrl);
    req.flush('Formato inválido', { status: 400, statusText: 'Bad Request' });
  });
});