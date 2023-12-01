import {HttpParams} from '@angular/common/http';
import {AbstractControl, ValidationErrors} from '@angular/forms';

export class Utils {
  static objectToHttpParams(o: object, leaveEmpty = false): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(o)) {
      if (value != null && (leaveEmpty || value !== '')) {
        params = params.append(key, value instanceof String ? value.trim() : value);
      }
    }
    return params;
  }

  static setPasswordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirmation = control.get('passwordConfirmation');

    return password?.value === passwordConfirmation?.value ? null : {passwordMismatch: true};
  }
}
