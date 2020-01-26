'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jazzyAuthenticate = require('jazzy-authenticate');
var request = _interopDefault(require('request'));

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

const tezleIdStrategy = {
  getUser: (query, done) => {
    authCodeRequest(query.code, (err, res) => {
      if (err) return done(err, false);
      if (!res || !res.body) return done(null, false);
      const {
        access_token: accessToken, userId, client: profile
      } = res.body;
      const user = {
        id: userId,
        accessToken,
        profile
      };
      if (res.body.enterprise) user.enterprise = res.body.enterprise;
      return done(null, user);
    });
  },
  extract: 'query'
};

/* eslint-disable consistent-return */

jazzyAuthenticate.setStrategy('tezleId', tezleIdStrategy, true);

const authorizationURL = () => `${credentials.authorizationUrl}?response_type=code&redirect_uri=${credentials.redirectUri}&client_id=${credentials.clientId}`;

const modify = (obj) => jazzyAuthenticate.modifyStrategy('tezleId', obj);

Object.defineProperty(exports, 'authenticate', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.authenticate;
  }
});
Object.defineProperty(exports, 'checkLogged', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.checkLogged;
  }
});
Object.defineProperty(exports, 'checkNotLogged', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.checkNotLogged;
  }
});
Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.init;
  }
});
Object.defineProperty(exports, 'login', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.login;
  }
});
Object.defineProperty(exports, 'logout', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.logout;
  }
});
Object.defineProperty(exports, 'setStrategy', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.setStrategy;
  }
});
exports.authorizationURL = authorizationURL;
exports.modify = modify;
exports.request = tezleRequest;
exports.setCredentials = setCredentials;
exports.tezleIdStrategy = tezleIdStrategy;
