import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './input-field.html',
})
export class InputField {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() type: string = 'text';
  @Input() control: FormControl = new FormControl();
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed';
  @Input() mask: string = '';
  @Input() dropSpecialCharacters: boolean = true;
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
}
