import request from 'request';

const makeRequest = (type, token, cb) => {
  request({
    url: `http://192.168.1.28:3000/api/external/${type}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      req: type
    },
    rejectUnauthorized: false
  }, cb);
};

const tezleRequest = (type, token, cb) => {
  makeRequest(type, token, (err, res) => {
    if (err) return cb(err, null);
    if (typeof res.body === 'string') return cb(new Error(res.body));
    return cb(err, res ? res.body : null);
  });
};

// eslint-disable-next-line import/prefer-default-export
export { tezleRequest as request };
