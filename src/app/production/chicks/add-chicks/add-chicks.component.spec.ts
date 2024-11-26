import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChicksComponent } from './add-chicks.component';

describe('AddChicksComponent', () => {
  let component: AddChicksComponent;
  let fixture: ComponentFixture<AddChicksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddChicksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddChicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
