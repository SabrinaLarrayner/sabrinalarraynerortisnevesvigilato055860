import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of, interval, startWith, switchMap, catchError, BehaviorSubject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService, LoginResponse } from './auth';

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
    interval(30000).pipe(
      startWith(0),
      switchMap(() => {
        const petsUrl = `${environment.api_url}/pets`.replace('/v1/v1', '/v1');
        const tutoresUrl = `${environment.api_url}/tutores`.replace('/v1/v1', '/v1');
        console.log(`[${new Date().toLocaleTimeString()}]  Verificando integridade da API...`);
        return forkJoin({
          pets: this.http.get(petsUrl).pipe(catchError(err => of(err))),
          tutores: this.http.get(tutoresUrl).pipe(catchError(err => of(err)))
        });
      })
    ).subscribe(results => {
      const isPetsAlive = results.pets.status === 200 || results.pets.status === 401 || results.pets.status === 403 || !results.pets.status;
      const isTutoresAlive = results.tutores.status === 200 || results.tutores.status === 401 || results.tutores.status === 403 || !results.tutores.status;
      if (isPetsAlive && isTutoresAlive) {
        console.log('API ONLINE', 'color: green; font-weight: bold;');
        this.apiOnlineSubject.next(true);
      } else {
        console.error('API OFFLINE', 'color: red; font-weight: bold;');
        this.apiOnlineSubject.next(false);
      }
    });
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