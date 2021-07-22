import express from 'express';

import pool, { query, insert, execute } from '../../../model/db.js';
import createQuery from '../../../model/query.js';

import errorGenerator from '../../../utils/errorGenerator.js';
import { decodeToken } from '../../../utils/jwt.js';
import validateAuth from '../../../middlewares/validateAuth.js';

import { MAX_TOWN_COUNT } from '../../../configs/constant.js';

const router = express.Router();
router.post('/', validateAuth, async (req, res, next) => {
  try {
    const { town } = req.body;

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    if (!town) {
      throw errorGenerator({
        message: 'no town',
        code: 'req/missing-town'
      });
    }

    const connection = await pool.getConnection(async conn => conn);
    connection.beginTransaction();

    const GET_TOWN_QUERY = createQuery('auth/GET_TOWN', { town });
    const townSnapshot = await query(connection, GET_TOWN_QUERY);

    let townID = '';

    if (!townSnapshot.data?.townID) {
      const INSERT_TOWN_QUERY = createQuery('auth/INSERT_TOWN', { town });
      townID = await insert(connection, INSERT_TOWN_QUERY);
    } else {
      townID = townSnapshot.data.townID;
    }

    const GET_TOWN_LIST_COUNT_QUERY = createQuery('auth/GET_TOWN_LIST_COUNT', { uid });
    const townListCountSnapshot = await query(connection, GET_TOWN_LIST_COUNT_QUERY);

    if (townListCountSnapshot.data.townListCount >= MAX_TOWN_COUNT) {
      throw errorGenerator({
        message: 'no more than max towns',
        code: 'town/max-town-exceed'
      });
    }

    const GET_TOWN_LIST_IS_ACTIVE_COUNT_QUERY = createQuery('auth/GET_TOWN_LIST_IS_ACTIVE_COUNT', { uid });
    const townListIsActiveSnapshot = await query(connection, GET_TOWN_LIST_IS_ACTIVE_COUNT_QUERY);

    const { isActiveCount } = townListIsActiveSnapshot.data;

    const isActive = isActiveCount < 1;

    const INSERT_TOWN_LIST_QUERY = createQuery('auth/INSERT_TOWN_LIST', { townID, uid, isActive });
    await execute(connection, INSERT_TOWN_LIST_QUERY);

    connection.commit();
    connection.release();

    res.status(200).json({ id: String(townID), name: town });
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case 'req/missing-town':
        res.status(400).json({
          message: '지역명을 입력해주세요'
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
