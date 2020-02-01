import {
  define,
  init,
  authenticate,
  checkLogged,
  logout,
  login,
  checkNotLogged,
  modify as modifyStrategy
} from 'jazzy-authenticate';
import { setCredentials, credentials } from './credentials';
import tezleIdStrategy from './tezleIdStrategy';
import { tezleClientRequest } from './apis/tezleClientApi';
import { tezleUserApi } from './apis/tezleIdUserApi';
import { tezleAppRequest } from './apis/tezleAppApi';

define('tezleId', tezleIdStrategy, true);

const authorizationURL = () => credentials.authorizationUrl;

const modify = (obj) => modifyStrategy('tezleId', obj);

const request = {
  app: tezleAppRequest,
  client: tezleClientRequest,
  user: tezleUserApi
};

export {
  request,
  authorizationURL,
  init,
  authenticate,
  checkLogged,
  logout,
  login,
  checkNotLogged,
  setCredentials,
  modify,
  tezleIdStrategy
};
