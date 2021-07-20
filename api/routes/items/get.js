import express from 'express';
import { query } from '../../model/db.js';
import errorGenerator from '../../utils/errorGenerator.js';
import validateAuth from '../../middlewares/validateAuth.js';

const router = express.Router();

router.get('/', validateAuth, async (req, res, next) => {
  try {
    const { type, category } = req.query;
    const TYPE = ['town', 'sale', 'liked'];
    if (!TYPE.includes(type)) {
      const error = errorGenerator(
        'wrong query variable',
        'req/wrong-query'
      );
      throw error;
    }

    // TODO: access token 해독

    const sql = QUERYS[type](category);

    const items = await query(sql);
    console.log(items);

    const productList = {
      id: '',
      name: '',
      town: '',
      timeCreated: '',
      price: '',
      isLiked: '',
      isOwner: true,
      likeCount: '',
      thumbnail: ''
    };

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

const QUERYS = {
  town: (category) => {
    // 무언가 다른 일도 함;
    return '';
  },
  sale: (category) => {
    return '';
  },
  liked: (category) => {
    return '';
  }
};

export default router;
