import express from 'express';

import pool, { query } from '../../model/db.js';
import createQuery from '../../model/query.js';

import validateAuth from '../../middlewares/validateAuth.js';
import { decodeToken } from '../../utils/jwt.js';

const router = express.Router();

router.get('/', validateAuth, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    const connection = await pool.getConnection(async conn => conn);

    const GET_USER_ID_QUERY = createQuery('auth/GET_USER_ID', { uid });
    const userSnapshot = await query(connection, GET_USER_ID_QUERY);

    const { userID } = userSnapshot.data;

    connection.release();

    res.status(201).json({ userID });
  } catch (err) {
    console.log(err);
    switch (err.code) {
      default:
        res.status(500).json({
          message: '다시 시도해주세요'
        });
    }
  }
});

export default router;
