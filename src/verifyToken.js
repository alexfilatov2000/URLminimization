const jwt = require('jsonwebtoken');

export const auth = async (ctx, next) => {
    const token = ctx.get('auth-token');
    // console.log(token);
    if (!token) return ctx.throw(400, 'access denied');
    try {
        // console.log(1);
        // eslint-disable-next-line no-undef
        ctx.request.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return next();
    } catch (err) {
        ctx.throw(400, err);
    }
};
