import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PetResponse {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: { url: string; };
}

@Injectable({ providedIn: 'root' })
export class PetsService {
  private http = inject(HttpClient);
  private API_URL = `${environment.api_url}/pets`;

  listAll(page: number = 0, size: number = 10, nome?: string, raca?: string): Observable<any> {
    const fromObject: any = { page, size };
    
    if (nome) fromObject.nome = nome;
    if (raca) fromObject.raca = raca;
  
    const params = new HttpParams({ fromObject });
    return this.http.get<any>(this.API_URL, { params });
  }

  create(petData: any): Observable<PetResponse> {
    return this.http.post<PetResponse>(this.API_URL, petData);
  }
}