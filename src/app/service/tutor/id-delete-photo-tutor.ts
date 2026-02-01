import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class IdDeletPhotoTutor {
  private http = inject(HttpClient);
  private readonly API = environment.api_url;

  deletePhoto(id: number, fotoId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/tutores/${id}/fotos/${fotoId}`);
  }
}