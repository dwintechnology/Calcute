module.exports = {
  amo: {
    login: '9151472655@mail.ru',
    hash: 'ac4aaea67ce92ca5abe3dfb2b1a6e512',
  },
  apps: {
    calcute: {
      serviceUrl: 'http://localhost:1111',
      debug: false,
    },
  },
  debug: false,
  mongo: {
    host: 'mongodb://localhost/calcute-test',
  },
  web: {
    port: 1111,
    host: '0.0.0.0',
  },
  logger: {
    info: () => {},
    log: () => {},
    warn: () => {},
  },
};
