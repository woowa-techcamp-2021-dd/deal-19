import express from 'express';

import pool, { query, queryAll } from '../../../model/db.js';
import errorGenerator from '../../../utils/errorGenerator.js';
import { decodeToken } from '../../../utils/jwt.js';

const router = express.Router();
router.post('/', async (req, res, next) => {
  try {
    const { townName, isActive } = req.body;
    const { authorization } = req.headers;
    const { uid } = decodeToken(authorization.split('Bearer ')[1]);

    const connection = await pool.getConnection(async conn => conn);

    const INSERT_TOWN_QUERY = `
      INSERT INTO TOWN (name) 
      VALUES('${townName}')
    `;

    const townSnapshot = await queryAll(connection, INSERT_TOWN_QUERY);
    const townId = townSnapshot.data.insertId;
    console.log('townSnapshot : ', townSnapshot);

    const INSERT_TOWN_LIST_QUERY = `
      INSERT INTO TOWN_LIST (TOWN_ID, USER_UID, is_active) 
      VALUES('${townId}', '${uid}', ${isActive})
    `;

    const townListSnapshot = await queryAll(connection, INSERT_TOWN_LIST_QUERY);
    console.log('townListSnapshot : ', townListSnapshot);

    res.status(200).json({ id: townId, name: townName });
  } catch (err) {
    console.log(err);
  }
});

export default router;
