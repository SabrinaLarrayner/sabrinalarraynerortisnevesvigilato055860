import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interface baseada no Request Body da sua API
export interface PetRequest {
  nome: string;
  raca: string;
  idade: number;
}
export interface PetResponse {
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
}

@Injectable({
  providedIn: 'root',
})

export class CreatePets {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.api_url}/pets`;
  execute(pet: PetRequest): Observable<PetResponse> {
    return this.http.post<PetResponse>(this.API_URL, pet);
  }
}