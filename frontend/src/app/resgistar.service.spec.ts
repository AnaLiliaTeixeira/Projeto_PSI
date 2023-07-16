import { TestBed } from '@angular/core/testing';

import { ResgistarService } from './resgistar.service';

describe('ResgistarService', () => {
  let service: ResgistarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResgistarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
