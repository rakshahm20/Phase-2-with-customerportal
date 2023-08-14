import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerConfigComponent } from './customer-config.component';

describe('CustomerConfigComponent', () => {
  let component: CustomerConfigComponent;
  let fixture: ComponentFixture<CustomerConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerConfigComponent]
    });
    fixture = TestBed.createComponent(CustomerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
