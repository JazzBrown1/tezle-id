import {
  defineModel,
  init,
  authenticate,
  checkAuthenticated,
  logout,
  checkUnauthenticated,
  modifyModel
} from 'jazzy-authenticate';
import { setCredentials, credentials } from './credentials';
import tezleIdModel from './tezleIdModel';
import { tezleClientRequest } from './apis/tezleClientApi';
import { tezleUserApi } from './apis/tezleIdUserApi';
import { tezleAppRequest } from './apis/tezleAppApi';

defineModel('tezleId', tezleIdModel, true);

const authorizationURL = () => credentials.authorizationUrl;

const modify = (obj) => modifyModel('tezleId', obj);

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
  checkAuthenticated,
  logout,
  checkUnauthenticated,
  setCredentials,
  modify,
  tezleIdModel
};
