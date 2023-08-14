import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnetComponent } from './subnet.component';

describe('SubnetComponent', () => {
  let component: SubnetComponent;
  let fixture: ComponentFixture<SubnetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubnetComponent]
    });
    fixture = TestBed.createComponent(SubnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
