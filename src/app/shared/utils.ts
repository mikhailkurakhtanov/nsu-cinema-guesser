import {AbstractControl, ValidationErrors} from '@angular/forms';

export class Utils {
  static setPasswordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirmation = control.get('passwordConfirmation');

    return password?.value === passwordConfirmation?.value ? null : {passwordMismatch: true};
  }
}
