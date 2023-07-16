import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizadorVisitadoComponent } from './utilizador-visitado.component';

describe('UtilizadorVisitadoComponent', () => {
  let component: UtilizadorVisitadoComponent;
  let fixture: ComponentFixture<UtilizadorVisitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilizadorVisitadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilizadorVisitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
