import express from 'express';

import main from './main/index.js';
import productDetail from './productDetail/index.js';
import location from './location/index.js';
import editor from './editor/index.js';

const router = express.Router();

router.use('/', main);
router.use('/productDetail', productDetail);
router.use('/editor', editor);
router.use('/location', location);

export default router;
