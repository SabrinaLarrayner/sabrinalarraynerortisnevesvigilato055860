import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthFacade } from '../../service/auth/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, Card, InputField, Button, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  public facade = inject(AuthFacade);

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
      this.facade.login(this.loginForm.getRawValue());
    }
  }
}