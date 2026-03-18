import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MushroomPickingComponent } from './mushroom-picking.component';

describe('MushroomPickingComponent', () => {
  let component: MushroomPickingComponent;
  let fixture: ComponentFixture<MushroomPickingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MushroomPickingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MushroomPickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
