const jwt = require('jsonwebtoken');

class AuthService {

  static extractToken = (req) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined' && bearerHeader !== '') {
      return bearerHeader.split(' ')[1];
    }
    const queryToken = req.query.accessToken;
    if (typeof queryToken !== 'undefined' && queryToken !== '') {
      return queryToken;
    }
    return null;
  };

  static validTokenMiddleware = (req, res, next) => {
    const token = AuthService.extractToken(req);
    try {
      req.authData = AuthService.validateToken('token', token);
      next();
    } catch(e) {
      res.status(401).send({error: e.message})
    }
  };

  static validateToken = (type, token) => {
    switch (type) {
      case 'code':
        return jwt.verify(token, process.env.JWT_CODE_SECRET);
      case 'token':
        return jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      case 'refresh':
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      default:
        return false;
    }
  };

  static generateCode = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_CODE_SECRET, {expiresIn: '30s'});
  };

  static generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_TOKEN_SECRET, {expiresIn: '30min'});
  };

  static generateRefreshToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
  };

}

module.exports = AuthService;

