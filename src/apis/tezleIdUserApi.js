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
    let response = null;
    try {
      response = JSON.parse(res.body);
    } catch (e) {
      cb('response not in JSON format');
    }
    return cb(err, response);
  });
};

// eslint-disable-next-line import/prefer-default-export
export { tezleUserApi };
