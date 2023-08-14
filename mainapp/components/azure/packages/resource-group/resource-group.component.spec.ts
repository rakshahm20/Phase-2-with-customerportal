import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceGroupComponent } from './resource-group.component';

describe('ResourceGroupComponent', () => {
  let component: ResourceGroupComponent;
  let fixture: ComponentFixture<ResourceGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceGroupComponent]
    });
    fixture = TestBed.createComponent(ResourceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
