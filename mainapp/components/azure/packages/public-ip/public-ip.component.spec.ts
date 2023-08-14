import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicIpComponent } from './public-ip.component';

describe('PublicIpComponent', () => {
  let component: PublicIpComponent;
  let fixture: ComponentFixture<PublicIpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicIpComponent]
    });
    fixture = TestBed.createComponent(PublicIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
