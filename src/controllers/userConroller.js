import client from '../../models/db';
import argon2 from 'argon2';
import {registerSchema, loginSchema, resetSchema} from '../validation';
import jwt from 'jsonwebtoken';
import {getPasswordResetURL, resetPasswordTemplate} from '../resetPsw'
import nodemailer from "nodemailer"
import ipp from 'ip'

export const registerPost = async(ctx) => {
    //Validate a data before we a user
    const {error} = registerSchema.validate(ctx.request.body);
    if (error) return ctx.body = {error : error.message};

    //Checking if the user is already in the database
    const emailExist = await client.query("SELECT * FROM users WHERE email = $1", [ctx.request.body.email]);
    if (emailExist.rows[0]) return ctx.body = {error : 'Email is already exist'};

    //Hash password
    const hash = await argon2.hash(ctx.request.body.password);

    //Create a new user
    await client.query("INSERT INTO users (email, password) VALUES ($1, $2)", [ctx.request.body.email, hash]);
    try {
        ctx.body = {user: true};
    } catch (err) {
        ctx.throw(400, err);
    }
};


export const loginPost = async(ctx) => {
    //Check if tables exists
//     this is db init, it shouldnt be done on each user login
    await client.query("do $$\n" +
        "begin\n" +
        "\tcall transfer();\n" +
        "end\n" +
        "$$;");
    //Validate a data before we a user
    const {error} = loginSchema.validate(ctx.request.body);
    if (error) return ctx.body = {error : error.message};

    //Checking if the email exists
    const user = await client.query("SELECT * FROM users WHERE email = $1", [ctx.request.body.email]);
    if (!user.rows[0]) return ctx.body = {error : 'Email is not found'};

    //Password is correct
    const validPass = await argon2.verify(user.rows[0].password, ctx.request.body.password);
    if(!validPass) return ctx.body = {error : 'Invalid password'};

    const accessToken = generateAccessToken({email: user.rows[0].email});
    // eslint-disable-next-line no-undef
    const refreshToken = jwt.sign(user.rows[0].email, process.env.REFRESH_TOKEN_SECRET);
    await client.query("INSERT INTO tokens (rtoken) VALUES ($1)", [refreshToken]);
    ctx.body = {user: true, accessToken: accessToken, refreshToken: refreshToken};
};

export const token = async(ctx) => {
    const refreshToken = ctx.request.body.token;
    if (refreshToken == null) return ctx.throw(401);

    const refreshTokens = await client.query("SELECT * FROM tokens WHERE rtoken = $1", [refreshToken]);
    if (!refreshTokens.rows[0]) return ctx.throw(403);
    // eslint-disable-next-line no-undef
    const verify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = generateAccessToken({ email: verify });
    ctx.body = { accessToken: accessToken, refreshToken: refreshToken};
};

function generateAccessToken(user) {
    // eslint-disable-next-line no-undef
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}


export const resetPassword = async(ctx) => {
    const email = ctx.request.body.email;

    let user = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!user.rows[0]) ctx.throw(404, "No user with that email");

    const token = jwt.sign({_id: user.rows[0].id}, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
    const url = getPasswordResetURL(user.rows[0], token)
    const emailTemplate = resetPasswordTemplate(user.rows[0], url)

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_LOGIN,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    let info = await transporter.sendMail(emailTemplate);
    //console.log("Message sent: %s", info.messageId);
    ctx.body = true;
};

export const receiveNewPassword = async(ctx) => {
    const { _id, token } = ctx.params;
    const { password } = ctx.request.body;
    //Token Validation
    try {
        jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch (err) {
        return ctx.body = {error : 'Time is over'};
    }
    //Password Validation
    const {error} = resetSchema.validate(ctx.request.body);
    if (error) return ctx.body = {error : error.message};

    let user = await client.query("SELECT * FROM users WHERE id = $1", [_id]);
//     use limit 1 where you need only 1 record
    if (!user.rows[0]) ctx.throw(500);

    const payload = jwt.decode(token, process.env.RESET_TOKEN_SECRET);
    if (payload._id === user.rows[0].id) {
        const hash = await argon2.hash(password);
        await client.query("UPDATE users SET password = $1 WHERE id = $2", [hash, _id]);
//         check doc, its possible sql injection I can use % and * in email
        ctx.body = {_id, token, error: 'Your password has been saved', submitted: true};
    } else {
        ctx.throw(400, "Something wrong")
    }
}

