import express from 'express';
import errorGenerator from '../../utils/errorGenerator.js';
import pool, { query } from '../../model/db.js';
import { decodeToken } from '../../utils/jwt.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, category, price, content } = req.body;
    const { authorization } = req.headers;
    const { uid } = decodeToken(authorization.split('Bearer ')[1]);
    const connection = await pool.getConnection(async conn => conn);

    const QUERY = `INSERT INTO PRODUCT (name, category, content, price, USER_UID, TOWN_ID) VALUES('${name}', '${category.id}', '${content}', ${price}, ${uid}, (SELECT TOWN_ID FROM TOWN_LIST WHERE USER_UID = ${uid} AND is_active = 1))`;

    await query(connection, QUERY);
  } catch (err) {
    console.log(err);
    // 디비에 넣는거 실패한 경우
  }
});

export default router;
