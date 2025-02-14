import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBioModalComponent } from './profile-bio-modal.component';

describe('ProfileBioModalComponent', () => {
  let component: ProfileBioModalComponent;
  let fixture: ComponentFixture<ProfileBioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBioModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileBioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
