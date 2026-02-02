import { Component, inject } from '@angular/core';
import { InputSegmentedControl } from '../../components/input-segmented-control/input-segmented-control';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-toggle-view',
  standalone: true, 
  imports: [InputSegmentedControl, MatIconModule, CommonModule],
  templateUrl: './layout-toggle-view.html',
})
export class LayoutToggleView {
  private router = inject(Router);

  isSelected: string = this.router.url.includes('tutors') ? 'Tutores' : 'Pets';

  onValueChange(value: string) {
    this.isSelected = value;
    if (value === 'Pets') {
      this.router.navigate(['/list-pets']);
    } else {
      this.router.navigate(['/list-tutors']);
    }
  }

  logout(): void {
    console.log('Saindo...');
    this.router.navigate(['/login']);
  }
}