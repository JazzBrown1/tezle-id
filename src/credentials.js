const credentials = {
  redirectUri: process.env.TZL_REDIRECT_URI || null,
  clientId: process.env.TZL_CLIENT_ID || null,
  clientSecret: process.env.TZL_CLIENT_SECRET || null,
  authorizationUrl: 'http://192.168.1.28:3000/authorize',
  tokenUrl: 'http://192.168.1.28:3000/oauth/token',
};

const setCredentials = (redirectUri, clientId, clientSecret, authorizationUrl, tokenUrl) => {
  credentials.redirectUri = redirectUri;
  credentials.clientId = clientId;
  credentials.clientSecret = clientSecret;
  if (authorizationUrl) credentials.authorizationUrl = authorizationUrl;
  if (tokenUrl) credentials.tokenUrl = tokenUrl;
};

export { credentials, setCredentials };
