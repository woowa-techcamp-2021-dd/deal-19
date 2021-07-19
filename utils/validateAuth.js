import jwt from 'jsonwebtoken';
import errorGenerator from './errorGenerator.js';

async function validateAuth (req, res, next) {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
      throw errorGenerator(
        err.message,
        'auth/invalid-token'
      );
    });
    next();
  } catch (err) {
    console.log(err.code);
    console.log(err.message);
    switch (err.code) {
      case 'auth/unauthorized-user':
        res.status(400).json({});
        break;
      case 'auth/invalid-token':
        res.status(401).json({});
        break;
      default:
        res.status(500).json({});
    }
  }
}

export default validateAuth;
