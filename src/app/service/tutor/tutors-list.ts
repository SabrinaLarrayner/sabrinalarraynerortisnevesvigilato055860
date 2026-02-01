import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TutorResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Array<{
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: number; 
    foto?: {
      id: number;
      nome: string;
      url: string;
    }
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class TutorsListService {
  private http = inject(HttpClient);
  private readonly API = `${environment.api_url}/tutores`;
  execute(page: number = 0, size: number = 10, nome?: string): Observable<TutorResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (nome && nome.trim() !== '') {
      params = params.set('nome', nome);
    }

    return this.http.get<TutorResponse>(this.API, { params });
  }
}
