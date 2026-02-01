import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TutorRequest {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
}

export interface TutorResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto: {
    id: number;
    nome: string;
    contentType: string;
    url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CreateTutorService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.api_url}/tutores`;

  // Mudei o nome do parâmetro para 'tutor' para fazer mais sentido
  execute(tutor: TutorRequest): Observable<TutorResponse> {
    return this.http.post<TutorResponse>(this.API_URL, tutor);
  }
}
