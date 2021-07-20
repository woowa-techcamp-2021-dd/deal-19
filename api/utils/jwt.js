import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRE_DATE = Math.floor(Date.now() / 1000) + (60 * 60 * 24);

export const createToken = (option) => {
  const token = jwt.sign({
    exp: ACCESS_TOKEN_EXPIRE_DATE,
    ...option
  }, process.env.ACCESS_TOKEN_SECRET);

  return token;
};
