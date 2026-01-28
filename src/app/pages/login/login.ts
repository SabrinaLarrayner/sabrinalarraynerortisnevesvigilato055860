import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../../components/card/card';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Card, InputField, Button, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginFocused = false;
  isSenhaFocada = false;
  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });
  setLoginFocus(state: boolean) {
    this.isLoginFocused = state;
  }
  setSenhaFocus(state: boolean) {
    this.isSenhaFocada = state;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      };
      this.authService.login(credentials).subscribe({
        next: (res) => {
          console.log('Sucesso!', res);
          this.router.navigate(['/list-pets']);
        },
        error: (err) => {
          alert('Usuário ou senha inválidos!');
          console.error(err);
        }
      });
    }
  }
}