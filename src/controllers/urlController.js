import validUrl from 'valid-url';
import shortid from 'shortid';
import client from '../../models/db';
import geoip from 'geoip-lite';
//import publicIp from 'public-ip';
import parser from 'ua-parser-js'


export const main = async(ctx) => {
    //Get unique elements from db
    //todo: use multiline strings
    const newLoc = await client.query("SELECT country_code, device_type, redirection_type, long_url, short_url, count(*)\n" +
        "FROM redirection\n" +
        "GROUP BY country_code, device_type, redirection_type, long_url, short_url");
    ctx.body = {links: newLoc.rows, user: ctx.request.user.email};

};

export const createShortLink = async(ctx) => {
    //todo remove unused code
    let ua = parser(ctx.get('user-agent'));
    console.log(ua);

    const longUrl = ctx.request.body.OriginalName;
    const urlCode = shortid.generate();

    if (validUrl.isUri(longUrl)) {
        try {
            await client.query("INSERT INTO urlshema (longurl, urlcode) VALUES ($1, $2)", [longUrl, urlCode]);
            return ctx.body = {urlCode: urlCode};

        } catch (err) {
            ctx.throw(400, err);
        }
    }
    return ctx.throw(400, 'invalid longUrl');
};


export const redirectByCode = async(ctx) => {
    //console.log(ctx.request.user.email);
    let ua = parser(ctx.get('user-agent'));
    //todo: fallback to real ip, correct handle of multiple proxies https://developer.mozilla.org/ru/docs/Web/HTTP/%D0%97%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BA%D0%B8/X-Forwarded-For
    let geo = geoip.lookup(ctx.get('x-forwarded-for'));

    //let ip = await publicIp.v4();
    //let geo = geoip.lookup(ip)    

    const urlCode = ctx.params.code;
    const url = await client.query("SELECT * FROM urlshema WHERE urlcode = $1", [urlCode]);

    try {
        await client.query("INSERT INTO redirection (country_code, device_type, redirection_type, long_url, short_url)\n"+
            "VALUES($1, $2, $3, $4, $5)", [geo.country, ua.os.name, 301, url.rows[0].longurl, urlCode]);
       //todo: 301 code is one of avalible redirection types, not only one

        return ctx.redirect(url.rows[0].longurl);

    } catch (err) {
        ctx.throw(400, err);
    }
};


