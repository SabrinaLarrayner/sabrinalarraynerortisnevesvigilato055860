import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface photoResponse {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class IdPhotoTutor {
  private http = inject(HttpClient);
  private readonly API = environment.api_url; 


  uploadPhoto(id: number, file: File): Observable<photoResponse> {
    const formData = new FormData();
    formData.append('foto', file);

    return this.http.post<photoResponse>(
      `${this.API}/tutores/${id}/fotos`, 
      formData
    );
  }
}