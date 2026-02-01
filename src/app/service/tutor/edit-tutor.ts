import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TutorUpdatePayload {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
}

@Injectable({
  providedIn: 'root',
})
export class EditTutorService {
  private http = inject(HttpClient);
  private readonly API = `${environment.api_url}/tutores`;

  update(id: number, tutor: TutorUpdatePayload): Observable<any> {
    return this.http.put<any>(`${this.API}/${id}`, tutor);
  }
}