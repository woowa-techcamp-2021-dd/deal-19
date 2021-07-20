import express from 'express';

import signin from './signin/index.js';
import signup from './signup/index.js';
import towns from './towns/index.js';

const router = express.Router();

router.use('/signin', signin);
router.use('/signup', signup);
router.use('/towns', towns);

export default router;
