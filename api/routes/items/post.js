import express from 'express';
import errorGenerator from '../../utils/errorGenerator.js';
import pool, { query } from '../../model/db.js';
import { decodeToken } from '../../utils/jwt.js';
import validateAuth from '../../middlewares/validateAuth.js';
const router = express.Router();

router.post('/', validateAuth, async (req, res, next) => {
  try {
    if (isInValidatedBody(req.body)) {
      throw errorGenerator('invalid body', 'req/invalid-body');
    }
    const { authorization } = req.headers;
    const { name, categoryID, price, content } = req.body;
    const { uid } = decodeToken(authorization.split('Bearer ')[1]);

    const connection = await pool.getConnection(async conn => conn);

    const QUERY = `
    INSERT INTO PRODUCT (name, category, content, price, USER_UID, TOWN_ID) VALUES('${name}', '${categoryID}', '${content}', ${price}, ${uid}, 
    (SELECT TOWN_ID FROM TOWN_LIST WHERE USER_UID = ${uid} AND is_active = 1))`;

    await query(connection, QUERY);
    res.status(200).json({});
  } catch (err) {
    switch (err.code) {
      case 'req/invalid-body':
        res.status(400).json({
          message: '유효하지 않은 양식입니다. 입력값을 확인해주세요'
        });
        break;
      default:
        console.log('dlrh');
        res.status(500).json({
          message: '다시 시도해주세요'
        });
    }
  }
});

const isInValidatedBody = ({ name, categoryID, price, content }) => {
  return isInValidatedName(name) || isInValidatedCategory(categoryID) || isInValidatedPrice(price) || isInValidatedContent(content);
};

const isInValidatedName = (name) => {
  if (name === '') return true;
  if (+Buffer.byteLength(name, 'utf8') > 30) return true;
  return false;
};

const isInValidatedCategory = (categoryID) => {
  if (categoryID === '') return true;
  if (+Buffer.byteLength(categoryID, 'utf8') > 12) return true;
  return false;
};

const isInValidatedPrice = (price) => {
  return !Number.isInteger(+price);
};

const isInValidatedContent = (content) => {
  return typeof content !== 'string';
};

export default router;
