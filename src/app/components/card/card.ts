import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe isso

@Component({
  selector: 'app-card',
  standalone: true, // Garanta que isso esteja aqui
  imports: [CommonModule], // Adicione aqui
  templateUrl: './card.html',
})
export class Card { }