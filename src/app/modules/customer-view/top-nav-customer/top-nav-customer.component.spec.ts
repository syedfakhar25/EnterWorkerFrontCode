import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavCustomerComponent } from './top-nav-customer.component';

describe('TopNavCustomerComponent', () => {
  let component: TopNavCustomerComponent;
  let fixture: ComponentFixture<TopNavCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopNavCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
