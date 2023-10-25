import {Component, OnInit, Self} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs';

import {AuthService} from '@core/services/auth/auth.service';
import {NgOnDestroy} from '@core/services/ng-on-destroy/ng-on-destroy.service';
import {constants} from '@shared/constants';
import {LoginForm} from '@shared/models/form/login-form.model';

@Component({
  selector: 'cinema-guesser-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgOnDestroy],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  readonly formErrors = constants.formErrors;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    @Self() private destroy: NgOnDestroy,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    const formData = this.form.getRawValue() as LoginForm;
    this.authService
      .authorize(formData)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.router.navigate(['']));
  }
}
