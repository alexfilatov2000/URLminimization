import {
    registerPost,
    loginPost,
    token,
    resetPassword,
    receiveNewPassword,
} from '../controllers/userConroller';

const Router = require('koa-router');

const router = new Router();

router
    .post('/register', registerPost)
    .post('/login', loginPost)
    .post('/token', token)
    .post('/resetPassword', resetPassword)
    .post('/password/reset/:_id/:token', receiveNewPassword);

export default router.routes();
