export const constants = {
  apiUrl: 'http://localhost:8080/api/v1',
  defaultSnackBarDuration: 3000,
  form: {
    limits: {
      maxLengthSm: 64,
      maxLengthLg: 128,
    },
    errors: {
      email: 'Некорректный формат Email',
      required: 'Поле обязательно для заполнения',
      maxLength: 'Превышено допустимое кол-во символов',
      passwordMismatch: 'Пароли не совпадают',
    },
  },
  localStorage: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  },
};
