import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InputField } from '../../components/input-field/input-field';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { LayoutToggleView } from '../../layout/layout-toggle-view/layout-toggle-view';
import { PetsService, PetResponse } from '../../service/pets'; 

@Component({
  selector: 'app-list-pets',
  standalone: true, 
  imports: [MatIconModule, InputField, Button, Card, LayoutToggleView],
  templateUrl: './list-pets.html',
})
export class ListPets implements OnInit {
  private petService = inject(PetsService);
  public pets: PetResponse[] = [];
  ngOnInit(): void {
    this.carregarPets();
  }
  carregarPets(): void {
    this.petService.listAll().subscribe({
      next: (dados) => {
        this.pets = dados;
        console.log('Pets carregados com sucesso:', dados);
      },
      error: (err) => {
        console.error('Erro ao conectar com a API:', err);
      }
    });
  }
}