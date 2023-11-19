import {FormControl} from '@angular/forms';

import {UserRole} from '@shared/types';

export interface Register {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface RegisterForm {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  passwordConfirmation: FormControl<string>;
}
