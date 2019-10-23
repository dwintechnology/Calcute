/**  Expected to be an identifier of deployment stage. */
const { NODE_ENV } = process.env;

/** All the following keys are required to be set in runtime environment. */
const {
  /* Ящики администраторов для проверочных писем заявок, через запятую. */
  ADMINS = '' /* '9166620250@mail.ru' */,

  /* Доступ к amocrm API для ТО. Юзер и токен, разделенные двоеточием. */
  AMO_KKTO = '' /* '9151472655@mail.ru:ac4aaea67ce92ca5abe3dfb2b1a6e512' */,

  /* Доступ к amocrm API мегагром. Юзер и токен, разделенные двоеточием. */
  AMO_MEGAGROM = '' /* megagromup@yandex.ru:e601b7c548cc6d101ad3391aafec0335'  */,

  /* Доступ к почте в виде пользователя и пароля, разделенных двоеточием. */
  EMAIL_AUTH = '' /* 'i@kasko-calculators.ru:qweasd123' */,

  /* Домен IMAP-сервера для отправки почты. */
  EMAIL_BOX = '' /* 'imap.mail.ru:993' */,

  /* Домен SMTP-сервера для отправки почты. */
  EMAIL_TRANSPORT = '' /* 'mail.ru' */,

  /* Ящики менеджеров, через запятую. */
  MANAGERS = '' /* 'project.varlamov@yandex.ru,9151472655@mail.ru' */,

  /* Публичный URL калькулятора. */
  PUBLIC_URL = '' /* 'http://localhost:8000' */,

  /* Доступ к админке. Юзер и пароль через двоеточие. */
  SUPER_USER = '' /* 'komandacube:qweasd123' */,
} = process.env;

const [emailAuthUser, emailAuthPass] = EMAIL_AUTH.split(':');
const [imapHost, imapPort] = EMAIL_BOX.split(':');
const amoKkto = AMO_KKTO.split(':');
const amoMegagrom = AMO_MEGAGROM.split(':');
const superUser = SUPER_USER.split(':');

module.exports = {
  apps: {
    calcute: {
      serviceUrl: PUBLIC_URL,
    },
  },
  debug: NODE_ENV === 'development',
  mongo: {
    host: 'mongodb://mongo/calcute',
  },
  web: {
    port: 8000,
    host: '0.0.0.0',
  },
  cubeCrmUrl: 'http://crm:8080',
  postAfterMs: 4 * 60 * 1000,
  inspectionIdOffset: 1000,

  /**
   * WARNING! Sensitive data. Prefer inject values from process.env.
   * Don't forget that all the secrets you set here will appear in git repo too.
   */
  mail: {
    defaultFrom: emailAuthUser,
    feedbackTo: MANAGERS,
    releaseFeedbacksTo: ADMINS,
    transport: {
      service: EMAIL_TRANSPORT,
      auth: {
        user: emailAuthUser,
        pass: emailAuthPass,
      },
    },
    imap: {
      host: imapHost,
      port: imapPort,
      user: emailAuthUser,
      password: emailAuthPass,
      tls: true,
    },
  },
  amo: {
    domain: 'kkto',
    login: amoKkto[0],
    hash: amoKkto[1],
  },
  webhooks: {
    amoUsers: [
      {
        domain: 'megagrom',
        login: amoMegagrom[0],
        hash: amoMegagrom[1],
      },
    ],
  },
  admin: {
    users: [
      {
        username: superUser[0],
        password: superUser[1],
        logApiRequests: false,
      },
    ],
  },
  logger: console,
  /** @deprecated key, do not use it */
  publicApi: { users: [] },
};
