import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSecurityGroupComponent } from './network-security-group.component';

describe('NetworkSecurityGroupComponent', () => {
  let component: NetworkSecurityGroupComponent;
  let fixture: ComponentFixture<NetworkSecurityGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkSecurityGroupComponent]
    });
    fixture = TestBed.createComponent(NetworkSecurityGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
