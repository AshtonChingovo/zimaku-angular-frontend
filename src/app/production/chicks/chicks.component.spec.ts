import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChicksComponent } from './chicks.component';

describe('ChicksComponent', () => {
  let component: ChicksComponent;
  let fixture: ComponentFixture<ChicksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChicksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
