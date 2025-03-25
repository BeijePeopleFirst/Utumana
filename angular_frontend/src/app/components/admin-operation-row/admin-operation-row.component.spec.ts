import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOperationRowComponent } from './admin-operation-row.component';

describe('AdminOperationRowComponent', () => {
  let component: AdminOperationRowComponent;
  let fixture: ComponentFixture<AdminOperationRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOperationRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOperationRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
