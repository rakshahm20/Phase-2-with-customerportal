import { TestBed } from '@angular/core/testing';

import { CloudapiService } from './cloudapi.service';

describe('CloudapiService', () => {
  let service: CloudapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
