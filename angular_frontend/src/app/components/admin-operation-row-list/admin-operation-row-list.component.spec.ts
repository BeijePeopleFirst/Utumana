import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOperationRowListComponent } from './admin-operation-row-list.component';

describe('AdminOperationRowListComponent', () => {
  let component: AdminOperationRowListComponent;
  let fixture: ComponentFixture<AdminOperationRowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOperationRowListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOperationRowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
