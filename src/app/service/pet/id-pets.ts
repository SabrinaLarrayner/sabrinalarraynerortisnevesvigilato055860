import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interface detalhada baseada no Schema da sua API
export interface PetDetailResponse {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: {
    id: number;
    nome: string;
    contentType: string;
    url: string;
  } | null;
  tutores: Array<{
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: number;
    foto?: {
      id: number;
      nome: string;
      contentType: string;
      url: string;
    };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class IdPets {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.api_url}/pets`;
  
  execute(id: number): Observable<PetDetailResponse> {
    return this.http.get<PetDetailResponse>(`${this.API_URL}/${id}`);
  }
}