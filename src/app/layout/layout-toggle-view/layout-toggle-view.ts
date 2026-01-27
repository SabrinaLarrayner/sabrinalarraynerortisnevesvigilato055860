import { Component } from '@angular/core';
import { InputSegmentedControl } from '../../components/input-segmented-control/input-segmented-control';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-toggle-view',
  imports: [InputSegmentedControl, MatIconModule, CommonModule],
  templateUrl: './layout-toggle-view.html',
})
export class LayoutToggleView {
  isSelected: string = 'Pets'
}
