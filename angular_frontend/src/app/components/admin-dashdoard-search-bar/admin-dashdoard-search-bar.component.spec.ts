import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashdoardSearchBarComponent } from './admin-dashdoard-search-bar.component';

describe('AdminDashdoardSearchBarComponent', () => {
  let component: AdminDashdoardSearchBarComponent;
  let fixture: ComponentFixture<AdminDashdoardSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashdoardSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashdoardSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
