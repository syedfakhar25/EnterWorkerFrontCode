import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProjectDetailsComponent } from './customer-project-details.component';

describe('CustomerProjectDetailsComponent', () => {
  let component: CustomerProjectDetailsComponent;
  let fixture: ComponentFixture<CustomerProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProjectDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
