import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-segmented-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-segmented-control.html',
})
export class InputSegmentedControl {
  @Input() options: string[] = ['Pets', 'Tutores'];
  @Input() value: string = 'Pets'; 
  @Output() valueChange = new EventEmitter<string>();

  select(option: string) {
    this.value = option;
    this.valueChange.emit(option);
  }
}