import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-layout-defaut',
  standalone: true,
  imports: [
    MatIconModule, 
    RouterOutlet
  ],
  templateUrl: './layout-defaut.html',
})
export class LayoutDefaut { }