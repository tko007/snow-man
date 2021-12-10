import { TestBed } from '@angular/core/testing';

import { WordGeneratorService } from './word-generator.service';

describe('WordGeneratorService', () => {
  let service: WordGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
