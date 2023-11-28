import {Component, OnInit, Self} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {WebPageService} from '@core/services/web-page.service';
import {Register, RegisterForm} from '@features/auth/models/register-form.model';
import {AuthService} from '@features/auth/services/auth.service';
import {constants} from '@shared/constants';
import {AppPath} from '@shared/enums/app-path.enum';
import {Utils} from '@shared/utils';

@Component({
  selector: 'cinema-guesser-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../assets/styles/auth-form.scss'],
  providers: [NgOnDestroy],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup<RegisterForm>;
  registerData!: Register;

  readonly AppPath = AppPath;
  readonly formErrors = constants.form.errors;

  constructor(
    @Self() private destroy: NgOnDestroy,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private webPageService: WebPageService,
  ) {}

  ngOnInit(): void {
    this.webPageService.setTitle('Регистрация');
    this.initializeForm();
  }

  private initializeForm(): void {
    const formLimits = constants.form.limits;
    this.form = this.formBuilder.group<RegisterForm>(
      {
        email: this.formBuilder.nonNullable.control<string>('', [
          Validators.required,
          Validators.email,
          Validators.maxLength(formLimits.maxLengthSm),
        ]),
        password: this.formBuilder.nonNullable.control<string>('', [Validators.required, Validators.maxLength(formLimits.maxLengthLg)]),
        passwordConfirmation: this.formBuilder.nonNullable.control<string>('', [
          Validators.required,
          Validators.maxLength(formLimits.maxLengthLg),
        ]),
        username: this.formBuilder.nonNullable.control<string>('', [Validators.required, Validators.maxLength(formLimits.maxLengthSm)]),
      },
      {validators: Utils.setPasswordMatchValidator},
    );

    this.registerData = {
      email: '',
      username: '',
      password: '',
      role: 'USER',
    };
  }

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }

    this.registerData.email = this.form.get('email')!.value;
    this.registerData.password = this.form.get('password')!.value;
    this.registerData.username = this.form.get('username')!.value;

    this.authService
      .register(this.registerData)
      .pipe(takeUntil(this.destroy))
      .subscribe(() =>
        this.router
          .navigate([''])
          .then(() => this.snackBar.open('Вы вошли в систему', undefined, {duration: constants.defaultSnackBarDuration})),
      );
  }
}
