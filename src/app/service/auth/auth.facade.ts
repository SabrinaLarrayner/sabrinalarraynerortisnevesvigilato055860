import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { AuthService, LoginResponse } from './auth';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private apiOnlineSubject = new BehaviorSubject<boolean>(true);
  readonly apiOnline$ = this.apiOnlineSubject.asObservable();

  login(credentials: { username: string; password: string }): void {
    this.loadingSubject.next(true);

    this.authService.login(credentials).subscribe({
      next: (res: LoginResponse) => {
        this.isAuthenticatedSubject.next(true);
        this.loadingSubject.next(false);
        this.router.navigate(['/list-pets']);
      },
      error: (err) => {
        this.loadingSubject.next(false);
        console.error('Falha na autenticação:', err);
        alert('Usuário ou senha inválidos.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  checkApiHealth(): void {
    this.http.get('https://pet-manager-api.geia.vip/v1/pets?size=1').pipe(
      tap(() => {
        this.apiOnlineSubject.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.apiOnlineSubject.next(true);
        } else {
          this.apiOnlineSubject.next(false);
        }
        return of(null);
      })
    ).subscribe();
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value && !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  updateAuthState(isLoggedIn: boolean): void {
    this.isAuthenticatedSubject.next(isLoggedIn);
  }
}