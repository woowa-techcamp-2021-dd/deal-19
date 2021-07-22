import express from 'express';

import pool, { query, execute } from '../../../model/db.js';
import createQuery from '../../../model/query.js';

import validateAuth from '../../../middlewares/validateAuth.js';
import errorGenerator from '../../../utils/errorGenerator.js';
import { decodeToken } from '../../../utils/jwt.js';

const router = express.Router();

router.delete('/', validateAuth, async (req, res, next) => {
  try {
    const { townID } = req.body;

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    if (!townID) {
      throw errorGenerator({
        message: 'no town ID',
        code: 'req/missing-townID'
      });
    }

    const connection = await pool.getConnection(async conn => conn);

    const GET_TOWN_LIST_COUNT_QUERY = createQuery('auth/GET_TOWN_LIST_COUNT', { uid });
    const townListCountSnapshot = await query(connection, GET_TOWN_LIST_COUNT_QUERY);

    if (townListCountSnapshot.data.townListCount === 1) {
      throw errorGenerator({
        message: 'unable to clear town list',
        code: 'town/unable-to-clear'
      });
    }

    const DELETE_TOWN_LIST_QUERY = createQuery('auth/DELETE_TOWN_LIST', { townID, uid });
    await execute(connection, DELETE_TOWN_LIST_QUERY);

    connection.release();

    res.status(200).json({ townID });
  } catch (err) {
    switch (err.code) {
      case 'req/missing-townID':
        res.status(400).json({
          message: '잘못된 삭제 요청입니다'
        });
        break;
      case 'town/unable-to-clear':
        res.status(409).json({
          message: '잘못된 삭제 요청입니다'
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
