import express from 'express';

import pool, { execute } from '../../../model/db.js';
import createQuery from '../../../model/query.js';

import errorGenerator from '../../../utils/errorGenerator.js';
import { decodeToken } from '../../../utils/jwt.js';
import validateAuth from '../../../middlewares/validateAuth.js';

const router = express.Router();
router.put('/:townID', validateAuth, async (req, res, next) => {
  try {
    const { townID } = req.params;

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    if (!townID) {
      throw errorGenerator({
        message: 'no town id',
        code: 'req/missing-query'
      });
    }

    const connection = await pool.getConnection(async conn => conn);
    connection.beginTransaction();

    const CLEAR_TOWN_LIST_QUERY = createQuery('auth/CLEAR_TOWN_LIST', { uid });
    await execute(connection, CLEAR_TOWN_LIST_QUERY);

    const ACTIVATE_TOWN_LIST_QUERY = createQuery('auth/ACTIVATE_TOWN_LIST', { uid, townID });
    await execute(connection, ACTIVATE_TOWN_LIST_QUERY);

    connection.commit();
    connection.release();

    res.status(200).json({ townID: String(townID) });
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case 'req/missing-query':
        res.status(400).json({
          message: '잘못된 요청입니다.'
        });
        break;
      case 'town/max-town-exceed':
        res.status(409).json({
          message: '3개 이상의 동네는 등록할 수 없습니다'
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
