import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetDeleteImg } from './pet-delete-img';
import { environment } from '../../../environments/environment';
import { vi } from 'vitest';

describe('PetDeleteImg', () => {
  let service: PetDeleteImg;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetDeleteImg],
    });

    service = TestBed.inject(PetDeleteImg);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve deletar a imagem do pet com autorização', () => {
    const petId = 1;
    const fotoId = 10;
    const tokenMock = 'token-falso';
    localStorage.setItem('access_token', tokenMock);
    service.execute(petId, fotoId).subscribe();
    const req = httpMock.expectOne(
      `${environment.api_url}/pets/${petId}/fotos/${fotoId}`
    );

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${tokenMock}`);

    req.flush(null);
  });
});
