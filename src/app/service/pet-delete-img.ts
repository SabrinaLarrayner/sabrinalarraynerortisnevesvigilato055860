import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PetDeleteImg {
  private http = inject(HttpClient);
  private readonly API = `${environment.api_url}/pets`;
  
  execute(petId: number, fotoId: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.API}/${petId}/fotos/${fotoId}`, { headers });
  }
}
