import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbitTraderComponent } from './orbit-trader.component';

describe('OrbitTraderComponent', () => {
  let component: OrbitTraderComponent;
  let fixture: ComponentFixture<OrbitTraderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitTraderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrbitTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
