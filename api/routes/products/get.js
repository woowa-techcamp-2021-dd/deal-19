import express from 'express';

import pool, { query, queryAll } from '../../model/db.js';
import createQuery from '../../model/query.js';

import errorGenerator from '../../utils/errorGenerator.js';
import validateAuth from '../../middlewares/validateAuth.js';
import { decodeToken } from '../../utils/jwt.js';

const router = express.Router();

router.get('/', validateAuth, async (req, res, next) => {
  try {
    const { type, category, town } = req.query;

    const TYPE = ['town', 'sale', 'liked'];
    if (!TYPE.includes(type)) {
      const error = errorGenerator({
        message: 'wrong query variable',
        code: 'req/wrong-query'
      });
      throw error;
    }

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    const connection = await pool.getConnection(async conn => conn);

    const GET_PRODUCT_LIST_QUERY = createQuery('products/GET_PRODUCT_LIST', { type, uid, category, town });
    const productsSnapshot = await queryAll(connection, GET_PRODUCT_LIST_QUERY);

    connection.release();

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

router.get('/:pid', validateAuth, async (req, res, next) => {
  try {
    const { pid } = req.params;

    const token = req.headers.authorization.split('Bearer ')[1];
    const { uid } = decodeToken(token);

    const connection = await pool.getConnection(async conn => conn);

    const GET_PRODUCT_QUERY = createQuery('products/GET_PRODUCT', { uid, pid });
    const GET_PRODUCT_IMAGES_QUERY = createQuery('products/GET_PRODUCT_IMAGES', { pid });

    const productsSnapshot = await query(connection, GET_PRODUCT_QUERY);
    const productImagesSnapshot = await queryAll(connection, GET_PRODUCT_IMAGES_QUERY);

    connection.release();

    const images = productImagesSnapshot.data.map(({ imageUrl }) => imageUrl);
    const productData = productsSnapshot.data;

    const response = {
      images,
      name: productData.name,
      timeCreated: productData.timeCreated,
      price: productData.price,
      category: productData.category,
      content: productData.content,
      staus: productData.status,
      town: productData.town,
      likeCount: productData.likeCount,
      isLiked: productData.isLiked,
      seller: productData.seller,
      isOwner: uid === productData.userId
    };

    res.status(200).json(response);
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
