import express from 'express';

import pool, { insert, query } from '../../../model/db.js';
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

    const GET_USER_COUNT_QUERY = `
      SELECT
        COUNT(*) AS count
      FROM USER
      WHERE ID='${id}';
    `;

    const userCountSnapshot = await query(connection, GET_USER_COUNT_QUERY);

    if (userCountSnapshot.data.count) {
      throw errorGenerator(
        'already signed up',
        'auth/exisiting-id'
      );
    };

    connection.beginTransaction();

    const INSERT_USER_QUERY = `
      INSERT
        INTO USER (ID)
        VALUES ('${id}');
    `;

    const uid = await insert(connection, INSERT_USER_QUERY);

    const GET_TOWN_QUERY = `
      SELECT
        ID as townId
      FROM TOWN
      WHERE name='${town}'
    `;

    let townId = '';

    const townSnapshot = await query(connection, GET_TOWN_QUERY);

    if (!townSnapshot.data?.townId) {
      const INSERT_TOWN_QUERY = `
        INSERT
          INTO TOWN (name)
          VALUES ('${town}')
      `;

      townId = await insert(connection, INSERT_TOWN_QUERY);
    } else {
      townId = townSnapshot.data.townId;
    }

    const INSERT_TOWN_LIST_QUERY = `
      INSERT
        INTO TOWN_LIST (TOWN_ID, USER_UID, is_active)
        VALUES ('${townId}', '${uid}', true);
    `;

    await insert(connection, INSERT_TOWN_LIST_QUERY);

    connection.commit();

    const accessToken = createToken({ uid });

    res.status(201).json({
      accessToken
    });
  } catch (err) {
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
