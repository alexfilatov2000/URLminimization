import Koa from 'koa';
import serve from 'koa-static'
import path from 'path'
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import cors from '@koa/cors';
import router from './src/routers/index';

dotenv.config();

const App = new Koa();
const PORT = process.env.PORT || 5000;

App.use(cors());
App.use(bodyParser());

App.use(router.routes());
App.use(router.allowedMethods());

if (process.env.NODE_ENV === 'production') {
    App.use(serve('frontend/build'));

    App.get('*', async ctx => {
        ctx.response.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    })
}

App.listen(PORT, async () => {});
