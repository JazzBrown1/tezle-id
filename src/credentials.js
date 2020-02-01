import qs from 'querystring';

const credentials = {
  redirectUri: process.env.TZL_REDIRECT_URI || null,
  clientId: process.env.TZL_CLIENT_ID || null,
  clientSecret: process.env.TZL_CLIENT_SECRET || null,
  authorizationUrl: process.env.TZL_AUTHORIZATION_URL || 'https://192.168.1.28:3000/authorize',
  tokenUrl: process.env.TZL_TOKEN_URL || 'https://192.168.1.28:3000/oauth/token',
  userEndpoint: process.env.TZL_USER_ENDPOINT || 'https://192.168.1.28:3000/api/external',
  clientEndpoint: process.env.TZL_CLIENT_ENDPOINT || 'https://192.168.1.28:3000/api/client',
  appEndpoint: process.env.TZL_APP_ENDPOINT || 'https://192.168.1.28:3000/api/tezle'
};

const makeAuthorizationUrl = () => {
  credentials.authorizationUrl = `${credentials.authorizationUrl}?${qs.stringify({ response_type: 'code', redirect_uri: credentials.redirectUri, client_id: credentials.clientId })}`;
};

makeAuthorizationUrl();

const setCredentials = (redirectUri, clientId, clientSecret, authorizationUrl, tokenUrl) => {
  credentials.redirectUri = redirectUri;
  credentials.clientId = clientId;
  credentials.clientSecret = clientSecret;
  if (authorizationUrl) credentials.authorizationUrl = authorizationUrl;
  if (tokenUrl) credentials.tokenUrl = tokenUrl;
  makeAuthorizationUrl();
};


export { credentials, setCredentials };
