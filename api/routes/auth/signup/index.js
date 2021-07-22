import express from 'express';

import pool, { insert, query } from '../../../model/db.js';
import createQuery from '../../../model/query.js';

import errorGenerator from '../../../utils/errorGenerator.js';
import { createToken } from '../../../utils/jwt.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { id, town } = req.body;

    if (!id | !town) {
      throw errorGenerator(
        'no body',
        'req/missing-body'
      );
    }

    const connection = await pool.getConnection(async conn => conn);

    const GET_USER_COUNT_QUERY = createQuery('auth/GET_USER_COUNT', { id });
    const userCountSnapshot = await query(connection, GET_USER_COUNT_QUERY);

    if (userCountSnapshot.data.count > 0) {
      connection.release();
      throw errorGenerator({
        message: 'already signed up',
        code: 'auth/exisiting-id'
      });
    };

    connection.beginTransaction();

    const INSERT_USER_QUERY = createQuery('auth/INSERT_USER', { id });

    const uid = await insert(connection, INSERT_USER_QUERY);

    const GET_TOWN_QUERY = createQuery('auth/GET_TOWN', { town });
    const townSnapshot = await query(connection, GET_TOWN_QUERY);

    let townID = '';

    if (!townSnapshot.data?.townID) {
      const INSERT_TOWN_QUERY = createQuery('auth/INSERT_TOWN', { town });
      townID = await insert(connection, INSERT_TOWN_QUERY);
    } else {
      townID = townSnapshot.data.townID;
    }

    const INSERT_TOWN_LIST_QUERY = createQuery('auth/INSERT_TOWN_LIST', { townID, uid, isActive: true });
    await insert(connection, INSERT_TOWN_LIST_QUERY);

    connection.commit();
    connection.release();

    const accessToken = createToken({ uid });

    res.status(201).json({ accessToken, id });
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case 'req/missing-body':
        res.status(400).json({
          message: '올바른 정보를 입력해주세요'
        });
        break;
      case 'auth/exisiting-id':
        res.status(409).json({
          message: '이미 등록된 아이디입니다'
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
