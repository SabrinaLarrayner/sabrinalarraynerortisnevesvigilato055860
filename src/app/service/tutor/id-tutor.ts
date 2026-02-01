import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Foto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto: Foto;
}

export interface TutorResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto: Foto;
  pets: Pet[];
}

@Injectable({
  providedIn: 'root',
})
export class IdTutor {
  private http = inject(HttpClient);
  // Seguindo o padrão: base_url + /tutores
  private readonly API_URL = `${environment.api_url}/tutores`;

  execute(id: number): Observable<TutorResponse> {
    return this.http.get<TutorResponse>(`${this.API_URL}/${id}`);
  }
}
