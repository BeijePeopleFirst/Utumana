import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPasswordModalComponent } from './settings-password-modal.component';

describe('SettingsPasswordModalComponent', () => {
  let component: SettingsPasswordModalComponent;
  let fixture: ComponentFixture<SettingsPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsPasswordModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
