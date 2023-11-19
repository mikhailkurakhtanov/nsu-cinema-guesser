import {FormControl} from '@angular/forms';

export interface Login {
  login: string;
  password: string;
}

export interface LoginForm {
  login: FormControl<string>;
  password: FormControl<string>;
}
