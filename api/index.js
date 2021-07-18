import express from 'express';

import items from './items/index.js';
import auth from './auth/index.js';
import chat from './chat/index.js';

const router = express.Router();

router.use('/items', items);
router.use('/auth', auth);
router.use('/chat', chat);

export default router;
