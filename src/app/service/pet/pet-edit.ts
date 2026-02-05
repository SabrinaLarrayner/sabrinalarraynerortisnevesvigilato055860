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
  private readonly API = `${environment.api_url}/pets`;
  execute(id: number, pet: PetEditRequest): Observable<PetEditResponse> {
    const token = localStorage.getItem('access_token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<PetEditResponse>(`${this.API}/${id}`, pet, { headers });
  }
}