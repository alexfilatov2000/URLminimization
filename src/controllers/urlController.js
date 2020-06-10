import validUrl from 'valid-url';
import shortid from 'shortid';
import geoip from 'geoip-lite';
import publicIp from 'public-ip';
import parser from 'ua-parser-js';
import client from '../../models/db';

export const main = async (ctx) => {
    const email = ctx.request.user.email;
    // Get unique elements from db
    const newLoc = await client.query(`SELECT country_code, device_type, redirection_type, long_url, short_url, count(*)
        FROM redirection
        WHERE email = $1
        GROUP BY country_code, device_type, redirection_type, long_url, short_url`,
        [email],
        );

    ctx.body = { links: newLoc.rows, user: email};
};

export const createShortLink = async (ctx) => {
    //console.log(ctx.request.body)
    const email = ctx.request.body.Email
    const longUrl = ctx.request.body.OriginalName;
    const urlCode = shortid.generate();

    if (validUrl.isUri(longUrl)) {
        try {
            await client.query(
                'INSERT INTO urlshema (longurl, urlcode, email) VALUES ($1, $2, $3)',
                [longUrl, urlCode, email],
            );
            return (ctx.body = { urlCode });
        } catch (err) {
            ctx.throw(400, err);
        }
    }
    return ctx.throw(400, 'invalid longUrl');
};

export const redirectByCode = async (ctx) => {

    const ua = parser(ctx.get('user-agent'));
    // let geo = geoip.lookup(ctx.get('x-forwarded-for') || ctx.request.connection.remoteAddress);

    const ip = await publicIp.v4();
    const geo = geoip.lookup(ip);

    const urlCode = ctx.params.code;
    const url = await client.query(
        'SELECT * FROM urlshema WHERE urlcode = $1',
        [urlCode],
    );

    try {
        await client.query(
            `INSERT INTO redirection (country_code, device_type, redirection_type,
             long_url, short_url, ip_address, user_agent, email)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
            [geo.country, ua.os.name, 301, url.rows[0].longurl, urlCode, ip, ua, url.rows[0].email],
        );

        return ctx.redirect(url.rows[0].longurl);
    } catch (err) {
        ctx.throw(400, err);
    }
};
