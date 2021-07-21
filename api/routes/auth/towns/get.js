import express from 'express';

import pool, { queryAll } from '../../../model/db.js';
import validateAuth from '../../../middlewares/validateAuth.js';
import { decodeToken } from '../../../utils/jwt.js';

const router = express.Router();

router.get('/', validateAuth, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    const connection = await pool.getConnection(async conn => conn);

    const GET_TOWN_QUERY = `
      SELECT
        TOWN_LIST.TOWN_ID AS id,
        TOWN_LIST.is_active AS isActive,
        TOWN.name AS name
      FROM TOWN_LIST
      LEFT JOIN TOWN
        ON TOWN_LIST.TOWN_ID = TOWN.ID
      WHERE TOWN_LIST.USER_UID = '${uid}'
    `;

    const userSnapshot = await queryAll(connection, GET_TOWN_QUERY);

    const towns = userSnapshot.data.map((town) => {
      const { id, name, isActive } = town;
      return { id, name, isActive };
    });

    res.status(200).json({
      towns
    });
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
