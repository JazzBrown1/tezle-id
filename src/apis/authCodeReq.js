import request from 'request';
import { credentials } from '../credentials';

const authCodeRequest = (code, cb) => {
  request.post({
    url: credentials.tokenUrl,
    json: {
      grant_type: 'authorization_code',
      redirect_uri: credentials.redirectUri,
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      code
    },
    rejectUnauthorized: false
  }, cb);
};

// eslint-disable-next-line import/prefer-default-export
export { authCodeRequest };
