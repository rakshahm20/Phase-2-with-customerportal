import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BastionHostComponent } from './bastion-host.component';

describe('BastionHostComponent', () => {
  let component: BastionHostComponent;
  let fixture: ComponentFixture<BastionHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BastionHostComponent]
    });
    fixture = TestBed.createComponent(BastionHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
