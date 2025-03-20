import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordByUserLandingPageComponent } from './reset-password-by-user-landing-page.component';

describe('ResetPasswordByUserLandingPageComponent', () => {
  let component: ResetPasswordByUserLandingPageComponent;
  let fixture: ComponentFixture<ResetPasswordByUserLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordByUserLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordByUserLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
