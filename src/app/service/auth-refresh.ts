import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthRefreshService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API = `${environment.api_url}/autenticacao/refresh`;

  execute(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');

    // Se nem existir refresh_token, não adianta tentar; manda pro login
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token não encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    // O Swagger indica PUT para /autenticacao/refresh
    return this.http.put<any>(this.API, {}, { headers }).pipe(
      tap(res => {
        // MUITO IMPORTANTE: Salvar ambos os tokens retornados
        if (res.access_token && res.refresh_token) {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          console.log('Tokens renovados com sucesso');
        }
      }),
      catchError((err) => {
        // Se a API de refresh retornar 401 ou 403, o refresh_token morreu.
        // Nesse caso, limpamos tudo e forçamos o login.
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
        return throwError(() => err);
      })
    );
  }

  private logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}