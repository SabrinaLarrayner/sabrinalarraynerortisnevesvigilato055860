import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TutorAndPet {
  private http = inject(HttpClient);
  private readonly API = environment.api_url;

 
  linkPetToTutor(tutorId: number, petId: number): Observable<void> {
    return this.http.post<void>(`${this.API}/v1/tutores/${tutorId}/pets/${petId}`, {});
  }

  unlinkPetFromTutor(id: number, petId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/tutores/${id}/pets/${petId}`);
  }
}