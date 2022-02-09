import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProjectDrawingComponent } from './customer-project-drawing.component';

describe('CustomerProjectDrawingComponent', () => {
  let component: CustomerProjectDrawingComponent;
  let fixture: ComponentFixture<CustomerProjectDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProjectDrawingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProjectDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
