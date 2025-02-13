import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccommodationListComponent } from './search-accommodation-list.component';

describe('SearchAccommodationListComponent', () => {
  let component: SearchAccommodationListComponent;
  let fixture: ComponentFixture<SearchAccommodationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAccommodationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAccommodationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
