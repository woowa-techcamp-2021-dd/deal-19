import express from 'express';

import pool, { query, execute } from '../../../model/db.js';
import createQuery from '../../../model/query.js';

import validateAuth from '../../../middlewares/validateAuth.js';
import errorGenerator from '../../../utils/errorGenerator.js';
import { decodeToken } from '../../../utils/jwt.js';

const router = express.Router();

router.delete('/:townID', validateAuth, async (req, res, next) => {
  try {
    const { townID } = req.params;

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    if (!townID) {
      throw errorGenerator({
        message: 'no town ID',
        code: 'req/missing-townID'
      });
    }

    const connection = await pool.getConnection(async conn => conn);

    const CHECK_OWN_TOWN_QUERY = createQuery('auth/CHECK_OWN_TOWN', { uid, townID });
    const townOwnerSnapshot = await query(connection, CHECK_OWN_TOWN_QUERY);

    if (!townOwnerSnapshot.data.own) {
      connection.release();
      throw errorGenerator({
        message: 'unable to activate town',
        code: 'town/no-owner'
      });
    }

    const GET_TOWN_STATE_QUERY = createQuery('auth/GET_TOWN_STATE', { townID });
    const townStateSnapshot = await query(connection, GET_TOWN_STATE_QUERY);

    if (townStateSnapshot.data.isActive) {
      connection.release();
      throw errorGenerator({
        message: 'unable to delete active town',
        code: 'town/unable-delete-activated'
      });
    }

    const GET_TOWN_LIST_COUNT_QUERY = createQuery('auth/GET_TOWN_LIST_COUNT', { uid });
    const townListCountSnapshot = await query(connection, GET_TOWN_LIST_COUNT_QUERY);

    if (townListCountSnapshot.data.townListCount === 1) {
      connection.release();
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
    console.log(err);
    switch (err.code) {
      case 'req/missing-townID':
        res.status(400).json({
          message: '잘못된 삭제 요청입니다'
        });
        break;
      case 'town/no-owner':
        res.status(403).json({
          message: '권한이 없습니다'
        });
        break;
      case 'town/unable-delete-activated':
        res.status(409).json({
          message: '현재 활성화된 동네를 삭제할 수 없습니다'
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
