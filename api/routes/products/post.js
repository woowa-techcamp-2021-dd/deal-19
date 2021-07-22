import express from 'express';

import pool, { insert } from '../../model/db.js';
import createQuery from '../../model/query.js';

import errorGenerator from '../../utils/errorGenerator.js';
import { decodeToken } from '../../utils/jwt.js';
import validateAuth from '../../middlewares/validateAuth.js';
import { CATEGORY_LIST } from '../../configs/constant.js';

const router = express.Router();

router.post('/', validateAuth, async (req, res, next) => {
  try {
    if (isInvalidBody(req.body)) {
      throw errorGenerator({
        message: 'invalid body',
        code: 'req/invalid-body'
      });
    }

    const { name, categoryID, price, content } = req.body;

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    const connection = await pool.getConnection(async conn => conn);

    const INSERT_PRODUCT_QUERY = createQuery('products/INSERT_PRODUCT', {
      name,
      categoryID,
      content,
      price,
      uid
    });

    const pid = await insert(connection, INSERT_PRODUCT_QUERY);
    connection.release();

    res.status(200).json({ pid });
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

const isInvalidBody = ({ name, categoryID, price, content }) => {
  return isInvalidName(name) || isInvalidCategory(categoryID) || isInvalidPrice(price) || isInvalidContent(content);
};

const isInvalidName = (name) => {
  return name.length > 30 || name.length < 2;
};

const isInvalidCategory = (categoryID) => {
  return !CATEGORY_LIST.includes(categoryID);
};

const isInvalidPrice = (price) => {
  return !Number.isInteger(+price);
};

const isInvalidContent = (content) => {
  return typeof content !== 'string';
};

export default router;
