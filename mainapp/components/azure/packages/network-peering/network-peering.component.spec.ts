import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkPeeringComponent } from './network-peering.component';

describe('NetworkPeeringComponent', () => {
  let component: NetworkPeeringComponent;
  let fixture: ComponentFixture<NetworkPeeringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkPeeringComponent]
    });
    fixture = TestBed.createComponent(NetworkPeeringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
