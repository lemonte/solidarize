

const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const config = require('../../config.json');
const Users = require("./user");

var refreshTokens = {}
var secret = config.secret;

const users = new Users();


class AutenticationController {
  
  gerarToken(user, email) {
    const token = jwt.sign({ user }, secret, { expiresIn: 86400 });
    const refreshToken = randtoken.uid(256);
    refreshTokens[email] = refreshToken;
    return { token, refreshToken };
  }

  async login(body) {
    const response = await users.login(body);
    const { token, refreshToken } = this.gerarToken(response, body.email_user);
    return {
      token,
      refreshToken,
      "user": response,
    };
  }

  async refreshToken(req) {
    const user = req.user;
    const body = req.body;
    const refreshToken = body.refreshToken;
    const email = user.email_user;
    if ((email in refreshTokens) && (refreshTokens[email] == refreshToken)) {
      return this.gerarToken(user, email);
    }
    throw new Error('Token inválido');
  }

}
module.exports = AutenticationController;