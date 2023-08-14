import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkInterfaceComponent } from './network-interface.component';

describe('NetworkInterfaceComponent', () => {
  let component: NetworkInterfaceComponent;
  let fixture: ComponentFixture<NetworkInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkInterfaceComponent]
    });
    fixture = TestBed.createComponent(NetworkInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
