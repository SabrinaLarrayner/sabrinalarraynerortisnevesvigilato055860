import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() type: string = 'text';
  @Input() control: FormControl = new FormControl();

  // ADICIONE ESTAS DUAS LINHAS AQUI:
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
}
