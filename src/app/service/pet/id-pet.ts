import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FotoResponse {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface TutorResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: FotoResponse;
}

export interface PetDetailResponse {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: FotoResponse;
  tutores: TutorResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class IdPet {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.api_url}/pets`;


  execute(id: number): Observable<PetDetailResponse> {
    return this.http.get<PetDetailResponse>(`${this.API_URL}/${id}`);
  }
}
