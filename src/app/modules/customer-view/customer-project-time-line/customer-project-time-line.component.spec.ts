import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProjectTimeLineComponent } from './customer-project-time-line.component';

describe('CustomerProjectTimeLineComponent', () => {
  let component: CustomerProjectTimeLineComponent;
  let fixture: ComponentFixture<CustomerProjectTimeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProjectTimeLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProjectTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
