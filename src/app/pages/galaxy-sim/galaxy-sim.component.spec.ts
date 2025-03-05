import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaxySimComponent } from './galaxy-sim.component';

describe('GalaxySimComponent', () => {
  let component: GalaxySimComponent;
  let fixture: ComponentFixture<GalaxySimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalaxySimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalaxySimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
