import request from 'request';
import { credentials } from '../credentials';

const bearerRequest = (type, payload, token, cb) => {
  request({
    url: `${credentials.userEndpoint}/${type}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: payload,
    rejectUnauthorized: false
  }, cb);
};

const tezleUserApi = (type, payload, token, cb) => {
  bearerRequest(type, payload, token, (err, res) => {
    if (err) return cb(err, null);
    if (typeof res.body === 'string') return cb(new Error(res.body));
    return cb(err, res ? res.body : null);
  });
};

// eslint-disable-next-line import/prefer-default-export
export { tezleUserApi };
