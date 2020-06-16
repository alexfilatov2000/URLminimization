import Router from 'koa-router';
import {
    main,
    createShortLink,
    redirectByCode,
    allLinks
} from '../controllers/urlController';
import { auth } from '../verifyToken';

const router = new Router();

router
    .get('/', auth, main)
    .post('/api/url/shorten', createShortLink)
    .post('/api/allLinks', allLinks)
    .get('/:code', redirectByCode);

export default router.routes();
