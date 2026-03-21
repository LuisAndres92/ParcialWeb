import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroLayout } from './libro-layout';

describe('LibroLayout', () => {
  let component: LibroLayout;
  let fixture: ComponentFixture<LibroLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
