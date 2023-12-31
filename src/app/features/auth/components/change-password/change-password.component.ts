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
import {Utils} from '@shared/utils';

interface RecoverPasswordForm {
  email: FormControl<string>;
  confirmationCode: FormControl<string>;
  password: FormControl<string>;
  passwordConfirmation: FormControl<string>;
}

@Component({
  selector: 'cinema-guesser-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../../assets/styles/auth-form.scss'],
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

    this.form = this.formBuilder.group<RecoverPasswordForm>(
      {
        email: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email, Validators.maxLength(formLimits.maxLengthSm)],
        }),
        confirmationCode: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(formLimits.maxLengthSm)],
        }),
        password: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(formLimits.maxLengthSm)],
        }),
        passwordConfirmation: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(formLimits.maxLengthSm)],
        }),
      },
      {validators: Utils.setPasswordMatchValidator},
    );
  }

  sendConfirmationCode(): void {
    if (this.form.controls.email.invalid) {
      return;
    }

    this.authService
      .sendChangePasswordConfirmationCode(this.form.controls.email.value)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.snackBar.open('Письмо с кодом подтверждения отправлено');
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
        this.snackBar.open('Код успешно подтвержден');
        this.changePasswordFormIsVisible = true;
      });
  }

  changePassword(): void {
    if (this.form.invalid) {
      return;
    }

    const formData: ChangePassword = {
      resetCode: Number(this.form.controls.confirmationCode.value),
      email: this.form.controls.email.value,
      newPassword: this.form.controls.password.value,
    };

    this.authService
      .changePassword(formData)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.router.navigate([AppPath.LOGIN]).then(() => this.snackBar.open('Пароль успешно изменен')));
  }
}
