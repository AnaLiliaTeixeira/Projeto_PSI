import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateGameComponent } from './rate_game.component';

describe('RateGameComponent', () => {
  let component: RateGameComponent;
  let fixture: ComponentFixture<RateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
