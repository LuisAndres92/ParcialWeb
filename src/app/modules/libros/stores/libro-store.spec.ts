import { TestBed } from '@angular/core/testing';

import { LibroStore } from './libro-store';

describe('LibroStore', () => {
  let service: LibroStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibroStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
