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
  
  // Esta linha é a que resolve o erro NG8002
  @Input() disabled: boolean = false; 

  @Output() onClick = new EventEmitter<void>();

  handlePress() {
    // Adicione esta verificação para garantir que o clique não dispare se estiver desativado
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}