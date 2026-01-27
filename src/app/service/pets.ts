import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interface para o que a API nos devolve (Listagem)
export interface PetResponse {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: {
    url: string;
  };
}

// Interface para o que nós enviamos para a API (Criação - os parâmetros do Swagger)
// Baseado no PetRequestDto
export interface PetRequest {
  nome: string; // máx 100 caracteres
  raca: string; // máx 100 caracteres
  idade: number; // integer int32
}

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://pet-manager-api.geia.vip/v1/pets';

  // GET: Não precisa de parâmetros no body
  listAll(): Observable<PetResponse[]> {
    return this.http.get<PetResponse[]>(this.API_URL);
  }

  // POST: Aqui é onde entram os parâmetros (nome, raca, idade)
  create(petData: PetRequest): Observable<PetResponse> {
    return this.http.post<PetResponse>(this.API_URL, petData);
  }
}