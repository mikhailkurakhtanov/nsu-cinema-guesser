export const constants = {
  localStorage: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
  },
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
  apiUrl: 'https://tomcat.csfullstack.com/cinema-guesser-api/api/v1',
};
