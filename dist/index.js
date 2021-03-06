'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jazzyAuthenticate = require('jazzy-authenticate');
var qs = _interopDefault(require('querystring'));
var request$1 = _interopDefault(require('request'));

const credentials = {
  redirectUri: process.env.TZL_REDIRECT_URI || null,
  clientId: process.env.TZL_CLIENT_ID || null,
  clientSecret: process.env.TZL_CLIENT_SECRET || null,
  authorizationUrl: process.env.TZL_AUTHORIZATION_URL || 'https://192.168.1.28:3000/authorize',
  tokenUrl: process.env.TZL_TOKEN_URL || 'https://192.168.1.28:3000/oauth/token',
  userEndpoint: process.env.TZL_USER_ENDPOINT || 'https://192.168.1.28:3000/api/user',
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
        accessToken, userId, client: profile
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

jazzyAuthenticate.defineModel('tezleId', tezleIdStrategy, true);

const authorizationURL = () => credentials.authorizationUrl;

const modify = (obj) => jazzyAuthenticate.modifyModel('tezleId', obj);

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
Object.defineProperty(exports, 'checkAuthenticated', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.checkAuthenticated;
  }
});
Object.defineProperty(exports, 'checkUnauthenticated', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.checkUnauthenticated;
  }
});
Object.defineProperty(exports, 'init', {
  enumerable: true,
  get: function () {
    return jazzyAuthenticate.init;
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
exports.tezleIdModel = tezleIdStrategy;
