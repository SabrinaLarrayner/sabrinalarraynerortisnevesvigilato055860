import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar @if ou [type]
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true, // Certifique-se de que está como standalone
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './input-field.html',
})
export class InputField {
  // Use @Input para que o componente pai possa enviar os dados
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() type: string = 'text';
  
  // O control é o que conecta esse input com os dados do formulário
  @Input() control: FormControl = new FormControl(); 
}