/* eslint-disable consistent-return */

import {
  setStrategy,
  init,
  authenticate,
  checkLogged,
  logout,
  login,
  checkNotLogged,
  modifyStrategy
} from 'jazzy-authenticate';
import { request } from './tezleIdApi';
import { setCredentials, credentials } from './credentials';
import tezleIdStrategy from './tezleIdStrategy';

setStrategy('tezleId', tezleIdStrategy, true);

const authorizationURL = () => `${credentials.authorizationUrl}?response_type=code&redirect_uri=${credentials.redirectUri}&client_id=${credentials.clientId}`;

const modify = (obj) => modifyStrategy('tezleId', obj);

export {
  request,
  authorizationURL,
  setStrategy,
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
