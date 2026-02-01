import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PetEditRequest {
  nome: string;
  raca: string;
  idade: number;
}

export interface PetEditResponse {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: {
    id: number;
    nome: string;
    url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PetEdit {
  private http = inject(HttpClient);
  // Usando api_url que já possui o /v1 conforme o seu environment
  private readonly API = `${environment.api_url}/pets`;

  /**
   * Atualiza um pet existente enviando o Token de Autenticação.
   */
  execute(id: number, pet: PetEditRequest): Observable<PetEditResponse> {
    // 1. Recupera o token do local storage
    const token = localStorage.getItem('access_token'); 

    // 2. Configura os headers com o Bearer Token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Faz o PUT passando a URL com ID, o corpo da requisição e os headers
    return this.http.put<PetEditResponse>(`${this.API}/${id}`, pet, { headers });
  }
}