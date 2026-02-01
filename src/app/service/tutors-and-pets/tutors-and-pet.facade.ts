import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TutorAndPet } from './delete-tutor-and-pet';

@Injectable({
  providedIn: 'root',
})
export class tutorAndPet {
  private service = inject(TutorAndPet);

  linkPet(tutorId: number, petId: number): Observable<void> {
    return this.service.linkPetToTutor(tutorId, petId);
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    return this.service.unlinkPetFromTutor(tutorId, petId);
  }
  
}