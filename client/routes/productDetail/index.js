import express from 'express';
import path from 'path';

const router = express.Router();

const __dirname = path.resolve();

router.get('/:pid', (req, res, next) => {
  res.sendFile(__dirname + '/dist/productDetail/index.html');
});

export default router;
