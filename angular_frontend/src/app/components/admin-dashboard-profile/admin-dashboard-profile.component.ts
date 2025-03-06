import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from 'src/app/dtos/userDTO';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard-profile',
  templateUrl: './admin-dashboard-profile.component.html',
  styleUrls: ['./admin-dashboard-profile.component.css']
})
export class AdminDashboardProfileComponent implements OnChanges {
  @Input() user!: UserDTO;
  @Output() updateUser = new EventEmitter<UserDTO>();
  
  isEditing = false;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && !this.isEditing) {
      this.updateFormValues();
    }
  }

  private updateFormValues(): void {
    this.editForm.patchValue({
      name: this.user?.name || '',
      surname: this.user?.surname || '',
      email: this.user?.email || ''
    });
  }

  toggleEdit() {
    console.log('toggleEdit');
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.updateFormValues();
    } else {
      this.editForm.reset();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editForm.reset(this.updateFormValues());
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formValues = this.editForm.value;
      
      const updatePayload: Partial<UserDTO> = {
        id: this.user.id,
        ...(formValues.name !== this.user.name && { name: formValues.name }),
        ...(formValues.surname !== this.user.surname && { surname: formValues.surname }),
        ...(formValues.email !== this.user.email && { email: formValues.email }),
        ...(formValues.password && { password: formValues.password })
      };

      if (Object.keys(updatePayload).length > 1) { 
        this.userService.editUserInfo(updatePayload).subscribe({
          next: (updatedUser) => {
            if(updatedUser) {
              this.updateUser.emit(updatedUser);
              this.user = updatedUser;
            }
            this.isEditing = false;
            this.editForm.reset();
          },
          error: (error) => {
            console.error('Errore durante l\'aggiornamento', error);
          }
        });
      } else {
        this.isEditing = false;
      }
    }
  }
}