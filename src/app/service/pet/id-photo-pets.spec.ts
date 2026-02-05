import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IdPhotoPets, PhotoResponse } from './id-photo-pets';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('IdPhotoPets', () => {
  let service: IdPhotoPets;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IdPhotoPets]
    });

    service = TestBed.inject(IdPhotoPets);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o upload da foto enviando FormData', () => {
    const petId = 123;
    const mockFile = new File(['content'], 'dog.jpg', { type: 'image/jpeg' });
    
    const mockResponse: PhotoResponse = {
      id: 1,
      nome: 'dog.jpg',
      contentType: 'image/jpeg',
      url: 'http://api.com/fotos/1'
    };

    service.execute(petId, mockFile).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}/fotos`);
    
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    expect(req.request.body.has('foto')).toBe(true);
    expect(req.request.body.get('foto')).toEqual(mockFile);

    req.flush(mockResponse);
  });

  it('deve lidar com erro no upload da foto', () => {
    const petId = 1;
    const mockFile = new File([''], 'test.png');

    service.execute(petId, mockFile).subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}/fotos`);
    req.flush('Erro no servidor', { status: 500, statusText: 'Internal Server Error' });
  });
});