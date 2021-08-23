import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDisplayComponent } from './track-display.component';

describe('TrackDisplayComponent', () => {
  let component: TrackDisplayComponent;
  let fixture: ComponentFixture<TrackDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
