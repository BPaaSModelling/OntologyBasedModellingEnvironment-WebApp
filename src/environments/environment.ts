// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  auth: {
    domain: 'dev-aoame.eu.auth0.com',
    clientId: 'hnndSNGQ24vp0LJc9avBqTbEmuaZ9zuz',
    audience: 'https://aoame-webservice',
    scope: 'openid profile email read:messages',
    redirectUri: window.location.origin
  },
  httpInterceptor: {
    allowedList: [
      // Attach access tokens to any calls to '/api' (exact match)
      `http:localhost:8080/*`,

      // Attach access tokens to any calls that start with '/api/'
      '/*',

      // Match anything starting with /api/accounts, but also specify the audience and scope the attached
      // access token must have
      {
        uri: '/api/accounts/*',
        tokenOptions: {
          authorizationParams: {
            audience: 'http://my-api/',
            scope: 'read:accounts',
          }
        },
      },

      // Matching on HTTP method
      // {
      //   uri: '/api/orders',
      //   httpMethod: 'post',
      //   tokenOptions: {
      //     authorizationParams: {
      //       audience: 'http://my-api/',
      //       scope: 'write:orders',
      //     }
      //   },
      // },

      // Using an absolute URI
      // {
      //   uri: 'https://your-domain.auth0.com/api/v2/users',
      //   tokenOptions: {
      //     authorizationParams: {
      //       audience: 'https://your-domain.com/api/v2/',
      //       scope: 'read:users',
      //     }
      //   },
      // }
    ]
  }
};
