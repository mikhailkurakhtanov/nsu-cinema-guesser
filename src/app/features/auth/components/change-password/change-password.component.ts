import {Component, OnInit, Self} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {WebPageService} from '@core/services/web-page.service';
import {ChangePassword} from '@features/auth/models/change-password-form.model';
import {AuthService} from '@features/auth/services/auth.service';
import {constants} from '@shared/constants';
import {AppPath} from '@shared/enums/app-path.enum';

interface RecoverPasswordForm {
  email: FormControl<string>;
  confirmationCode: FormControl<string>;
  newPassword: FormControl<string>;
  newPasswordConfirmation: FormControl<string>;
}

@Component({
  selector: 'cinema-guesser-change-password',
  templateUrl: './change-password.component.html',
  providers: [NgOnDestroy],
})
export class ChangePasswordComponent implements OnInit {
  form!: FormGroup<RecoverPasswordForm>;

  confirmationCodeFormIsVisible = false;
  changePasswordFormIsVisible = false;

  readonly formErrors = constants.form.errors;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private webPageService: WebPageService,
    @Self() private destroy: NgOnDestroy,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.webPageService.setTitle('Изменение пароля');
    const formLimits = constants.form.limits;

    this.form = this.formBuilder.group<RecoverPasswordForm>({
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.maxLength(formLimits.maxLengthSm)],
      }),
      confirmationCode: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(formLimits.maxLengthSm)],
      }),
      newPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(formLimits.maxLengthSm)],
      }),
      newPasswordConfirmation: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(formLimits.maxLengthSm)],
      }),
    });
  }

  sendConfirmationCode(): void {
    if (this.form.controls.email.invalid) {
      return;
    }

    this.authService
      .sendChangePasswordConfirmationCode(this.form.controls.email.value)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.snackBar.open('Письмо с кодом подтверждения отправлено', undefined, {duration: constants.defaultSnackBarDuration});
        this.confirmationCodeFormIsVisible = true;
      });
  }

  confirmConfirmationCode(): void {
    const emailControl: FormControl<string> = this.form.controls.email;
    const codeControl: FormControl<string> = this.form.controls.confirmationCode;

    if (emailControl.invalid || codeControl.invalid) {
      return;
    }

    this.authService
      .validateChangePasswordConfirmationCode(emailControl.value, codeControl.value)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.snackBar.open('Код успешно подтвержден', undefined, {duration: constants.defaultSnackBarDuration});
        this.changePasswordFormIsVisible = true;
      });
  }

  changePassword(): void {
    if (this.form.invalid) {
      return;
    }

    const formData: ChangePassword = {
      email: this.form.controls.email.value,
      newPassword: this.form.controls.newPassword.value,
      newPasswordConfirmation: this.form.controls.newPasswordConfirmation.value,
    };

    this.authService
      .changePassword(formData)
      .pipe(takeUntil(this.destroy))
      .subscribe(() =>
        this.router
          .navigate([AppPath.LOGIN])
          .then(() => this.snackBar.open('Пароль успешно изменен', undefined, {duration: constants.defaultSnackBarDuration})),
      );
  }
}
