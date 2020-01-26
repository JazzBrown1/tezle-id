
import { authCodeRequest } from './authCodeReq';

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
export default tezleIdStrategy;
