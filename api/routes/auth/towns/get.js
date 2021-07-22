import express from 'express';

import pool, { queryAll } from '../../../model/db.js';
import createQuery from '../../../model/query.js';

import validateAuth from '../../../middlewares/validateAuth.js';
import { decodeToken } from '../../../utils/jwt.js';

const router = express.Router();

router.get('/', validateAuth, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    const connection = await pool.getConnection(async conn => conn);

    const GET_TOWN_QUERY = createQuery('auth/GET_TOWN_BY_UID', { uid });
    const userSnapshot = await queryAll(connection, GET_TOWN_QUERY);

    connection.release();

    const towns = userSnapshot.data.map((town) => {
      const { id, name, isActive } = town;
      return { id: String(id), name, isActive };
    });

    res.status(200).json({ towns });
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
