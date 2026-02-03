import { HttpClient, HttpHeaders, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';
import { HttpContextToken } from '@angular/common/http';

export const BYPASS_LOGIC = new HttpContextToken(() => false);

@Injectable({ providedIn: 'root' })
export class AuthRefreshService {
  private http = inject(HttpClient);
  private readonly API = `${environment.api_url}/autenticacao/refresh`;

  execute() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    return this.http.put<any>(this.API, {}, { 
      headers,
      context: new HttpContext().set(BYPASS_LOGIC, true) 
    }).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
      })
    );
  }
}