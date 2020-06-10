import users from './userRouter';
import url from './urlRouter';

const Router = require('koa-router');

const router = new Router();
const api = new Router();

api.use(users);
api.use(url);

router.use(api.routes());

export default router;
