import express from 'express';

import pool, { query, queryAll } from '../../../model/db.js';
import errorGenerator from '../../../utils/errorGenerator.js';
import { decodeToken } from '../../../utils/jwt.js';
import validateAuth from '../../../middlewares/validateAuth.js';

const router = express.Router();
router.post('/', validateAuth, async (req, res, next) => {
  try {
    const { townName, isActive } = req.body;
    const { authorization } = req.headers;
    const { uid } = decodeToken(authorization.split('Bearer ')[1]);

    if (!townName) {
      throw errorGenerator('no town', 'req/missing-town');
    }

    const connection = await pool.getConnection(async conn => conn);

    const INSERT_TOWN_QUERY = `
      INSERT INTO TOWN (name) 
      VALUES('${townName}')
    `;

    const townSnapshot = await queryAll(connection, INSERT_TOWN_QUERY);
    const townId = townSnapshot.data.insertId;

    const INSERT_TOWN_LIST_QUERY = `
      INSERT INTO TOWN_LIST (TOWN_ID, USER_UID, is_active) 
      VALUES('${townId}', '${uid}', ${isActive})
    `;

    await query(connection, INSERT_TOWN_LIST_QUERY);

    res.status(200).json({ id: String(townId), name: townName });
  } catch (err) {
    switch (err.code) {
      case 'req/missing-town':
        res.status(400).json({
          message: '지역명을 입력해주세요.'
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
