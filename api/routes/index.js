import express from 'express';

import items from './items/index.js';
import auth from './auth/index.js';

const router = express.Router();

router.use('/items', items);
router.use('/auth', auth);

export default router;
