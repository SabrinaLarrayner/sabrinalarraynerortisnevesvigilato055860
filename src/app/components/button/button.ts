import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './button.html',
})
export class Button {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'outline' = 'primary';  
  @Input() showIcon: boolean = false; 
  @Input() iconName: string = 'search'; 
  @Input() disabled: boolean = false; 
  @Input() type: 'button' | 'submit' = 'button'; 
  @Output() onClick = new EventEmitter<void>();
  handlePress() {
    console.log('Botão clicado!', { 
      type: this.type, 
      disabled: this.disabled, 
      variant: this.variant 
    });
  
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
  
}