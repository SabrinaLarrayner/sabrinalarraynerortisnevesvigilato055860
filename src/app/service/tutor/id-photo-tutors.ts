import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PhotoResponse {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class IdPhotoTutorsService {
  private http = inject(HttpClient);

  private readonly API_URL = `${environment.api_url}/tutores`;
  uploadPhoto(id: number, file: File): Observable<PhotoResponse> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<PhotoResponse>(
      `${this.API_URL}/${id}/fotos`,
      formData
    );
  }
}
