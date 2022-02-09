import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProjectOfferComponent } from './customer-project-offer.component';

describe('CustomerProjectOfferComponent', () => {
  let component: CustomerProjectOfferComponent;
  let fixture: ComponentFixture<CustomerProjectOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProjectOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProjectOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
