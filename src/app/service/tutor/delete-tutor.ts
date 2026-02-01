import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
  import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeleteTutor {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.api_url}/tutores`;

  execute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}