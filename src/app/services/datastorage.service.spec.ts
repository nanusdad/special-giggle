import { TestBed } from '@angular/core/testing';

import { DatastorageService } from './datastorage.service';

describe('DatastorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatastorageService = TestBed.get(DatastorageService);
    expect(service).toBeTruthy();
  });
});
