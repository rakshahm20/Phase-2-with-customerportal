import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualMachineComponent } from './virtual-machine.component';

describe('VirtualMachineComponent', () => {
  let component: VirtualMachineComponent;
  let fixture: ComponentFixture<VirtualMachineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualMachineComponent]
    });
    fixture = TestBed.createComponent(VirtualMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
