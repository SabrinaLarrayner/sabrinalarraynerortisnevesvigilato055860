import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetEdit, PetEditRequest, PetEditResponse } from './pet-edit';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('PetEdit', () => {
  let service: PetEdit;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetEdit]
    });

    service = TestBed.inject(PetEdit);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve atualizar os dados do pet enviando o token de autorização', () => {
    const petId = 123;
    const tokenMock = 'token-de-atualizacao';
    const petData: PetEditRequest = {
      nome: 'Rex',
      raca: 'Labrador',
      idade: 5
    };

    const mockResponse: PetEditResponse = {
      id: petId,
      ...petData
    };

    localStorage.setItem('access_token', tokenMock);

    service.execute(petId, petData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.nome).toBe('Rex');
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(petData);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${tokenMock}`);
    req.flush(mockResponse);
  });

  it('deve lidar com erro ao tentar editar um pet inexistente', () => {
    const petId = 999;
    localStorage.setItem('access_token', 'token-valido');

    service.execute(petId, { nome: 'Inexistente', raca: 'SRD', idade: 0 }).subscribe({
      next: () => fail('Deveria ter falhado com 404'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}`);
    req.flush('Pet não encontrado', { status: 404, statusText: 'Not Found' });
  });
});