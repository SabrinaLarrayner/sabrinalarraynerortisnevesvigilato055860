import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetsService, PetResponse } from './pets';
import { environment } from '../../../environments/environment';

describe('PetsService', () => {
  let service: PetsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetsService]
    });

    service = TestBed.inject(PetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listAll', () => {
    it('deve chamar a API com os parâmetros de paginação padrão', () => {
      service.listAll().subscribe();
      const req = httpMock.expectOne(req =>
        req.url === `${environment.api_url}/pets` &&
        req.params.get('page') === '0' &&
        req.params.get('size') === '10'
      );

      expect(req.request.method).toBe('GET');
      req.flush({ content: [], totalElements: 0 });
    });

    it('deve incluir filtros de nome e raça nos parâmetros quando fornecidos', () => {
      service.listAll(1, 20, 'Rex', 'Labrador').subscribe();

      const req = httpMock.expectOne(req =>
        req.params.get('nome') === 'Rex' &&
        req.params.get('raca') === 'Labrador' &&
        req.params.get('page') === '1'
      );

      expect(req.request.method).toBe('GET');
      req.flush({ content: [] });
    });
  });

  describe('create', () => {
    it('deve enviar um POST com os dados do pet', () => {
      const petData = { nome: 'Thor', raca: 'Pug', idade: 3 };
      const mockResponse: PetResponse = { id: 1, ...petData };

      service.create(petData).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.api_url}/pets`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(petData);

      req.flush(mockResponse);
    });
  });
});
