import {Component, OnInit, Self} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {WebPageService} from '@core/services/web-page.service';
import {Login} from '@features/auth/models/login-form.model';
import {AuthService} from '@features/auth/services/auth.service';
import {constants} from '@shared/constants';
import {AppPath} from '@shared/enums/app-path.enum';

@Component({
  selector: 'cinema-guesser-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../assets/styles/auth-form.scss'],
  providers: [NgOnDestroy],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  readonly AppPath = AppPath;
  readonly formErrors = constants.form.errors;

  constructor(
    @Self() private destroy: NgOnDestroy,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private webPageService: WebPageService,
  ) {}

  ngOnInit(): void {
    this.webPageService.setTitle('Авторизация');

    const formLimits = constants.form.limits;
    this.form = this.formBuilder.group({
      login: ['', [Validators.required, Validators.maxLength(formLimits.maxLengthSm)]],
      password: ['', [Validators.required, Validators.maxLength(formLimits.maxLengthLg)]],
    });
  }

  login(): void {
    const loginData = this.form.getRawValue() as Login;
    this.authService
      .authenticate(loginData)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.router.navigate(['']));
  }
}
