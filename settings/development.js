module.exports = {
  apps: {
    calcute: {
      serviceUrl: 'http://localhost:8050',
      debug: true,
    },
  },
  debug: true,
  web: {
    port: 8050,
    host: '0.0.0.0',
  },
  admin: {
    users: [
      {
        username: 'admin',
        password: 'admin',
        logApiRequests: false,
      },
    ],
  },
  crmUrl: 'http://localhost:8080/',
  gwUrl: 'http://localhost:8080/',
  gwUsername: 'cubegroup',
  gwPassword: 'mieSh2ut',
  postAfterMs: 4 * 60 * 1000,
  logger: console,
};
