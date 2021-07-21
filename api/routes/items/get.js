import express from 'express';
import pool, { queryAll } from '../../model/db.js';
import errorGenerator from '../../utils/errorGenerator.js';
import validateAuth from '../../middlewares/validateAuth.js';

import { decodeToken } from '../../utils/jwt.js';

const router = express.Router();

router.get('/', validateAuth, async (req, res, next) => {
  try {
    const { type, category, town } = req.query;
    const TYPE = ['town', 'sale', 'liked'];
    if (!TYPE.includes(type)) {
      const error = errorGenerator(
        'wrong query variable',
        'req/wrong-query'
      );
      throw error;
    }

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    const connection = await pool.getConnection(async conn => conn);

    let sql = `
      SELECT
        PRODUCT.ID AS id,
        PRODUCT.name AS name,
        PRODUCT.timecreated AS timeCreated,
        PRODUCT.price AS price,
        PRODUCT.USER_UID AS userId,
        TOWN.name AS town,
        (SELECT
        image_url
      FROM PRODUCT_IMAGES
      WHERE
        PRODUCT_ID = PRODUCT.ID
      ORDER BY timecreated ASC
      LIMIT 1
      ) AS thumbnail,
      (SELECT
        COUNT(*)
      FROM LIKE_LIST
      WHERE
        PRODUCT_ID = PRODUCT.ID
      ) AS likeCount,
      (SELECT
        USER_UID
      FROM LIKE_LIST
        WHERE (
        USER_UID = ${uid} AND PRODUCT_ID = PRODUCT.ID
        )
      ) AS isLiked
      FROM PRODUCT
      LEFT JOIN TOWN
        ON PRODUCT.TOWN_ID = TOWN.ID
    `;

    if (type === 'town') {
      sql += `
        WHERE
          TOWN_ID = 
          ${town || `
          (
            SELECT 
              TOWN_ID 
            FROM TOWN_LIST 
              WHERE
                USER_UID = ${uid}
                AND is_active=true
          )
          `}
          AND PRODUCT.status = 'onsale'
          ${
            category
            ? `AND PRODUCT.category = '${category}'`
            : ''
          }
      `;
    }

    if (type === 'sale') {
      sql += `
        WHERE
          PRODUCT.USER_UID = ${uid}
      `;
    }

    if (type === 'liked') {
      sql += `
        INNER JOIN LIKE_LIST
          ON LIKE_LIST.PRODUCT_ID = PRODUCT.ID
        WHERE
          LIKE_LIST.USER_UID = ${uid}
      `;
    }

    const productsSnapshot = await queryAll(connection, sql);

    const productList = productsSnapshot.data.map((product) => {
      return {
        id: product.id,
        name: product.name,
        town: product.town,
        timeCreated: product.timeCreated,
        price: product.price,
        isLiked: Boolean(product.isLiked),
        isOwner: product.userId === uid,
        likeCount: product.likeCount,
        thumbnail: product.thumbnail
      };
    });

    res.status(200).json({ productList });
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case 'req/wrong-query':
        res.status(400).json({});
        break;
      default:
        res.status(500).json({});
    }
  }
});

export default router;
