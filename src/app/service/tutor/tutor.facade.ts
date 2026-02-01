import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap, finalize } from 'rxjs';

import { IdTutor, TutorResponse as TutorDetailResponse } from './id-tutor';
import { TutorsListService, TutorResponse as TutorListResponse } from './tutors-list';
import { IdPhotoTutorsService } from './id-photo-tutors';
import { CreateTutorService, TutorRequest } from './create-tutors';
import { DeleteTutor } from './delete-tutor';
import { EditTutorService, TutorUpdatePayload } from './edit-tutor'; // Novo Import

@Injectable({
  providedIn: 'root',
})
export class TutorFacade {
  private idService = inject(IdTutor);
  private listService = inject(TutorsListService);
  private createService = inject(CreateTutorService);
  private photoService = inject(IdPhotoTutorsService);
  private deleteService = inject(DeleteTutor);
  private editService = inject(EditTutorService); // Injetando o serviço de edição

  private tutorSelectedSubject = new BehaviorSubject<TutorDetailResponse | null>(null);
  readonly tutorSelected$ = this.tutorSelectedSubject.asObservable();

  private tutorsListSubject = new BehaviorSubject<TutorListResponse | null>(null);
  readonly tutorsList$ = this.tutorsListSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  getById(id: number): void {
    this.loadingSubject.next(true);
    this.idService.execute(id).subscribe({
      next: (tutor) => {
        this.tutorSelectedSubject.next(tutor);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error fetching tutor by id:', err);
        this.tutorSelectedSubject.next(null);
        this.loadingSubject.next(false);
      }
    });
  }

  listAll(page: number = 0, size: number = 10, name?: string): void {
    this.loadingSubject.next(true);
    this.listService.execute(page, size, name).subscribe({
      next: (res) => {
        this.tutorsListSubject.next(res);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error fetching tutor list:', err);
        this.loadingSubject.next(false);
      }
    });
  }

  createWithPhoto(payload: TutorRequest, file: File | null): Observable<any> {
    this.loadingSubject.next(true);
    return this.createService.execute(payload).pipe(
      switchMap((tutor) => {
        if (file && tutor?.id) {
          return this.photoService.uploadPhoto(tutor.id, file);
        }
        return of(tutor);
      }),
      tap(() => {
        this.listAll();
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Atualiza os dados de um tutor e sincroniza o estado
   */
  update(id: number, payload: TutorUpdatePayload): Observable<any> {
    this.loadingSubject.next(true);
    return this.editService.update(id, payload).pipe(
      tap((updatedTutor) => {
        // Atualiza o tutor selecionado no estado com a resposta da API
        this.tutorSelectedSubject.next(updatedTutor);
        // Opcional: Atualiza a lista geral para refletir as mudanças
        this.listAll(); 
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  delete(id: number): void {
    this.loadingSubject.next(true);
    this.deleteService.execute(id).subscribe({
      next: () => {
        console.log('Tutor removido com sucesso');
        this.listAll();
      },
      error: (err) => {
        console.error('Erro ao excluir tutor:', err);
        this.loadingSubject.next(false);
      }
    });
  }

  uploadPhoto(id: number, file: File): Observable<any> {
    return this.photoService.uploadPhoto(id, file).pipe(
      tap((res) => {
        const current = this.tutorSelectedSubject.value;
        if (current && current.id === id) {
          this.tutorSelectedSubject.next({ ...current, foto: res });
        }
      })
    );
  }

  clearState(): void {
    this.tutorSelectedSubject.next(null);
    this.tutorsListSubject.next(null);
  }
}