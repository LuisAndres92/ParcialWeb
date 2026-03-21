import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroPage } from './libro-page';

describe('LibroPage', () => {
  let component: LibroPage;
  let fixture: ComponentFixture<LibroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
