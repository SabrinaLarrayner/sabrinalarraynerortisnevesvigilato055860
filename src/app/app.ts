import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFacade } from './service/auth/auth.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('desafio-seplag-frontend');
  public authFacade = inject(AuthFacade);
  private router = inject(Router);

// No seu app.ts
ngOnInit() {
  const token = localStorage.getItem('access_token');
  
  // SÓ chama se houver token. Se estiver no login, o token é null, 
  // então essa linha NUNCA será executada.
  if (token) {
    this.authFacade.checkApiHealth();
  }
}
}