import { TestBed } from '@angular/core/testing';

import { UtilizadorVisitadoService } from './utilizador-visitado.service';

describe('UtilizadorVisitadoService', () => {
  let service: UtilizadorVisitadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilizadorVisitadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
