import jwt from 'jsonwebtoken';
import errorGenerator from './errorGenerator.js';

async function validateAuth (req, res, next) {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      if (err) {
        switch (err.name) {
          case 'ToeknExpiredeError':
            throw errorGenerator(
              err.message,
              'auth/token-expired'
            );
          case 'JsonWebTokenError':
            throw errorGenerator(
              err.message,
              'auth/invalid-token'
            );
          default:
            throw errorGenerator(
              err.message,
              'auth/invalid-token'
            );
        }
      }
    });

    next();
  } catch (err) {
    console.log(err.code);
    switch (err.code) {
      case 'auth/token-expired':
        res.status(400).json({});
        break;
      case 'auth/invalid-token':
        res.status(400).json({});
        break;
      default:
        res.status(500).json({});
    }
  }
}

export default validateAuth;
