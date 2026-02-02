import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap, map } from 'rxjs';

import { PetsService } from './pets'; 
import { CreatePets } from './create-pets'; 
import { IdPhotoPets } from './id-photo-pets';
import { IdPet } from './id-pet';
import { IdPetDelete } from './id-pet-delete';
import { PetEdit } from './pet-edit';
import { PetDeleteImg } from './pet-delete-img';

@Injectable({
  providedIn: 'root',
})
export class PetFacade {
  private petService = inject(PetsService);
  private createService = inject(CreatePets);
  private photoService = inject(IdPhotoPets);
  private idPetService = inject(IdPet);
  private deleteService = inject(IdPetDelete);
  private editService = inject(PetEdit);
  private deleteImgService = inject(PetDeleteImg);
  private petsListSubject = new BehaviorSubject<any>(null);
  readonly petsList$ = this.petsListSubject.asObservable();

  readonly pets$ = this.petsList$.pipe(
    map(res => res?.content || [])
  );

  private petSelectedSubject = new BehaviorSubject<any>(null);
  readonly petSelected$ = this.petSelectedSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();


  getAll(): void {
    this.listAll(0, 100); 
  }

  listAll(page: number = 0, size: number = 10, search?: string): void {
    this.loadingSubject.next(true);
    const term = search?.trim() || '';

    this.petService.listAll(page, size, term).subscribe({
      next: (res: any) => {
        if (term !== '' && (!res.content || res.content.length === 0)) {
          this.fetchByBreed(page, size, term);
        } else {
          this.petsListSubject.next(res);
          this.loadingSubject.next(false);
        }
      },
      error: () => this.loadingSubject.next(false)
    });
  }

  private fetchByBreed(page: number, size: number, breed: string): void {
    this.petService.listAll(page, size, undefined, breed).subscribe({
      next: (res) => {
        this.petsListSubject.next(res);
        this.loadingSubject.next(false);
      },
      error: () => this.loadingSubject.next(false)
    });
  }

  getById(id: number): void {
    this.loadingSubject.next(true);
    this.idPetService.execute(id).subscribe({
      next: (pet) => {
        this.petSelectedSubject.next(pet);
        this.loadingSubject.next(false);
      },
      error: () => this.loadingSubject.next(false)
    });
  }

  createWithPhoto(payload: any, file: File | null): Observable<any> {
    this.loadingSubject.next(true);
    return this.createService.execute(payload).pipe(
      switchMap((pet) => {
        if (file && pet?.id) return this.photoService.execute(pet.id, file);
        return of(pet);
      }),
      tap({
        next: () => this.loadingSubject.next(false),
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  update(id: number, payload: any): Observable<any> {
    this.loadingSubject.next(true);
    return this.editService.execute(id, payload).pipe(
      tap({
        next: (updatedPet) => {
          this.petSelectedSubject.next(updatedPet);
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  delete(id: number): Observable<void> {
    this.loadingSubject.next(true);
    return this.deleteService.execute(id).pipe(
      tap({
        next: () => {
          this.loadingSubject.next(false);
          this.clearState(); 
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  uploadPhoto(id: number, file: File): Observable<any> {
    this.loadingSubject.next(true);
    return this.photoService.execute(id, file).pipe(
      tap({
        next: (newPhoto) => {
          const currentPet = this.petSelectedSubject.value;
          if (currentPet) {
            this.petSelectedSubject.next({ ...currentPet, foto: newPhoto });
          }
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  deletePhoto(petId: number, fotoId: number): Observable<void> {
    this.loadingSubject.next(true);
    return this.deleteImgService.execute(petId, fotoId).pipe(
      tap({
        next: () => {
          const currentPet = this.petSelectedSubject.value;
          if (currentPet) {
            this.petSelectedSubject.next({ ...currentPet, foto: null });
          }
          this.loadingSubject.next(false);
        },
        error: () => this.loadingSubject.next(false)
      })
    );
  }

  clearState(): void {
    this.petsListSubject.next(null);
    this.petSelectedSubject.next(null);
    this.loadingSubject.next(false);
  }
}