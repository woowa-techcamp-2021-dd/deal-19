import express from 'express';
import pool, { query, queryAll } from '../../../model/db.js';
import errorGenerator from '../../../utils/errorGenerator.js';
import { decodeToken } from '../../../utils/jwt.js';
import validateAuth from '../../../middlewares/validateAuth.js';

const router = express.Router();

router.delete('/', validateAuth, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { townId } = req.body;
    const { uid } = decodeToken(authorization.split('Bearer ')[1]);
    if (!townId) {
      throw errorGenerator('no townId', 'req/missing-townId');
    }

    const connection = await pool.getConnection(async conn => conn);

    const DELETE_TOWN_LIST_QUERY = `
    DELETE FROM TOWN_LIST WHERE TOWN_ID = ${Number(townId)} AND USER_UID = ${uid}
  `;
    const townListSnapshot = await queryAll(connection, DELETE_TOWN_LIST_QUERY);

    const DELETE_TOWN_QUERY = `
      DELETE FROM TOWN WHERE ID = ${Number(townId)}
    `;

    await queryAll(connection, DELETE_TOWN_QUERY);

    res.status(200).json({ townId });
  } catch (err) {
    switch (err.code) {
      case 'req/missing-townId':
        res.status(400).json({
          message: '잘못된 삭제 요청입니다.'
        });
        break;
      default:
        res.status(500).json({
          message: '다시 시도해주세요'
        });
    }
  }
});

export default router;
