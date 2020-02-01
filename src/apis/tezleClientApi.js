import request from 'request';
import { credentials } from '../credentials';

const tezleClientRequest = (type, payload, cb) => {
  request({
    auth: {
      user: credentials.clientId,
      pass: credentials.clientSecret,
      sendImmediately: true
    },
    url: `${credentials.clientEndpoint}/${type}`,
    json: payload,
    rejectUnauthorized: false
  }, (err, res) => cb(err, res && res.body ? res.body : null));
};

// eslint-disable-next-line import/prefer-default-export
export { tezleClientRequest };
