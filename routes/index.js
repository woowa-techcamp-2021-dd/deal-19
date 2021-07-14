import express from 'express';
import path from 'path';

const router = express.Router();
const __dirname = path.resolve();

router.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/dist/main/index.html');
});

export default router;
