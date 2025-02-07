import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DateValidators {
  static dateRange(checkInControl: AbstractControl, checkOutControl: AbstractControl): ValidationErrors | null {
    if (!checkInControl.value || !checkOutControl.value) {
      return null;
    }

    const checkIn = new Date(checkInControl.value);
    const checkOut = new Date(checkOutControl.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return { pastDate: true };
    }

    if (checkOut <= checkIn) {
      return { invalidRange: true };
    }

    return null;
  }
}