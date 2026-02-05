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

ngOnInit() {
  const token = localStorage.getItem('access_token');
  if (token) {
    this.authFacade.checkApiHealth();
  }
}
}