
import { authCodeRequest } from './apis/authCodeReq';
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
export default tezleIdStrategy;
