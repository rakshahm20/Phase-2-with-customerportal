import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePrincipleComponent } from './service-principle.component';

describe('ServicePrincipleComponent', () => {
  let component: ServicePrincipleComponent;
  let fixture: ComponentFixture<ServicePrincipleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicePrincipleComponent]
    });
    fixture = TestBed.createComponent(ServicePrincipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
