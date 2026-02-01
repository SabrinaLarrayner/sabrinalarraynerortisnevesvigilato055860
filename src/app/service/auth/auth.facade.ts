import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService, LoginResponse } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private authService = inject(AuthService);
  private router = inject(Router);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

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

 
  get isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }


  updateAuthState(isLoggedIn: boolean): void {
    this.isAuthenticatedSubject.next(isLoggedIn);
  }
}