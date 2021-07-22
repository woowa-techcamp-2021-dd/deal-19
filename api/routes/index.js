import express from 'express';

import products from './products/index.js';
import auth from './auth/index.js';

const router = express.Router();

router.use('/products', products);
router.use('/auth', auth);

export default router;
