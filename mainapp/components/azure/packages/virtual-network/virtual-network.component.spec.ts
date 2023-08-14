import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualNetworkComponent } from './virtual-network.component';

describe('VirtualNetworkComponent', () => {
  let component: VirtualNetworkComponent;
  let fixture: ComponentFixture<VirtualNetworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualNetworkComponent]
    });
    fixture = TestBed.createComponent(VirtualNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
