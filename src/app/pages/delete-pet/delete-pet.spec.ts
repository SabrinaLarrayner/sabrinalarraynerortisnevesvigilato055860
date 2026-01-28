import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePet } from './delete-pet';

describe('DeletePet', () => {
  let component: DeletePet;
  let fixture: ComponentFixture<DeletePet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
