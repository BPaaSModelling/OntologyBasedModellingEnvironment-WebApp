export const environment = {
  production: true,
  auth: {
    domain: 'dev-aoame.eu.auth0.com',
    clientId: 'hnndSNGQ24vp0LJc9avBqTbEmuaZ9zuz',
    audience: 'https://aoame-webservice',
    scope: 'openid profile email read:messages',
    redirectUri: window.location.origin
  },
};
