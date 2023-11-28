export const constants = {
  apiUrl: 'https://tomcat.csfullstack.com/cinema-guesser-api/api/v1',
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
