import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  isPasswordModalOpen: boolean = false;

  closePasswordModal(): void {
    this.isPasswordModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  showPasswordModal(): void {
    this.isPasswordModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
}
