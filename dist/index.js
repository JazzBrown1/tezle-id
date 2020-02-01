'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jazzyAuthenticate = require('jazzy-authenticate');
var request$1 = _interopDefault(require('request'));

const credentials = {
  redirectUri: process.env.TZL_REDIRECT_URI || null,
  clientId: process.env.TZL_CLIENT_ID || null,
  clientSecret: process.env.TZL_CLIENT_SECRET || null,
  authorizationUrl: process.env.TZL_AUTHORIZATION_URL || 'http://192.168.1.28:3000/authorize',
  tokenUrl: process.env.TZL_TOKEN_URL || 'http://192.168.1.28:3000/oauth/token',
  userEndpoint: process.env.TZL_USER_ENDPOINT || 'http://192.168.1.28:3000/api/external',
  clientEndpoint: process.env.TZL_CLIENT_ENDPOINT || 'http://192.168.1.28:3000/api/client',
  appEndpoint: process.env.TZL_APP_ENDPOINT || 'http://192.168.1.28:3000/api/tezle'
};

const setCredentials = (redirectUri, clientId, clientSecret, authorizationUrl, tokenUrl) => {
  credentials.redirectUri = redirectUri;
  credentials.clientId = clientId;
  credentials.clientSecret = clientSecret;
  if (authorizationUrl) credentials.authorizationUrl = authorizationUrl;
  if (tokenUrl) credentials.tokenUrl = tokenUrl;
};

const authCodeRequest = (code, cb) => {
  request$1.post({
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

// import { tezleUserApi } from './apis/tezleIdUserApi';

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
  extract: 'query',
  selfLogin: true
  /*
  // Future proposed jazzy auth method will be called after init or after login or logout
  // (before on success or next middleware is called).
  // By attaching the tzl object to the jazzy object we know it will be removed if the user logs out
  onLoggedStateChange: (req, res, next) => {
    if (req.jazzy.isLogged && req.user.accessToken) {
      req.jazzy.tzl = {
        request: (type, payload, cb) => tezleUserApi(type, req.user.accessToken, payload, cb)
      };
    } else req.jazzy.tzl = {};
    next();
  }
  */
};

const tezleClientRequest = (type, payload, cb) => {
  request$1({
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

const bearerRequest = (type, payload, token, cb) => {
  request$1({
    url: `${credentials.userEndpoint}/${type}`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      req: type
    },
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

const tezleAppRequest = (type, payload, cb) => {
  request$1({
    auth: {
      user: credentials.clientId,
      pass: credentials.clientSecret,
      sendImmediately: true
    },
    url: `${credentials.appEndpoint}/${type}`,
    json: payload,
    rejectUnauthorized: false
  }, (err, res) => cb(err, res && res.body ? res.body : null));
};

jazzyAuthenticate.define('tezleId', tezleIdStrategy, true);

const authorizationURL = () => `${credentials.authorizationUrl}?response_type=code&redirect_uri=${credentials.redirectUri}&client_id=${credentials.clientId}`;

const modify = (obj) => jazzyAuthenticate.modify('tezleId', obj);

const request = {
  app: tezleAppRequest,
  client: tezleClientRequest,
  user: tezleUserApi
};

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
exports.authorizationURL = authorizationURL;
exports.modify = modify;
exports.request = request;
exports.setCredentials = setCredentials;
exports.tezleIdStrategy = tezleIdStrategy;
