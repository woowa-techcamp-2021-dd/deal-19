import express from 'express';

import pool, { queryAll } from '../../../model/db.js';
import errorGenerator from '../../../utils/errorGenerator.js';
import { createToken } from '../../../utils/jwt.js';
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw errorGenerator(
        'no body',
        'req/no-req-body'
      );
    }

    const connection = await pool.getConnection(async conn => conn);

    const GET_USER_QUERY = `
      SELECT
        TOWN_LIST.TOWN_ID AS id,
        TOWN_LIST.is_active AS isActive,
        TOWN.name AS name,
        TOWN_LIST.USER_UID AS uid
      FROM TOWN_LIST
      LEFT JOIN TOWN
        ON TOWN_LIST.TOWN_ID = TOWN.ID
      WHERE TOWN_LIST.USER_UID = (
        SELECT
          UID
        FROM USER
        WHERE ID = '${id}'
      )
    `;

    const userSnapshot = await queryAll(connection, GET_USER_QUERY);

    if (userSnapshot.isEmpty) {
      throw errorGenerator(
        'user not exists',
        'auth/user-not-found'
      );
    }

    const towns = [];

    const uid = userSnapshot.data[0].uid;

    userSnapshot.data.forEach((town, i) => {
      const { id, name, isActive } = town;

      towns.push({
        id,
        name,
        isActive
      });
    });

    const accessToken = createToken({ uid });

    res.status(200).json({
      accessToken
    });
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case 'req/missing-body':
        res.status(400).json({
          message: '아이디를 입력해주세요'
        });
        break;
      case 'auth/user-not-found':
        res.status(404).json({
          message: '계정을 찾을 수 없습니다'
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
