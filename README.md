<h1 align="center">
  URL-Minimization
</h1>

<h4 align="center">What is URL-Minimization</h4>
<div>
  <p>Suppose you have an e-commerce application with different types of products under different categories. <br><br>
       Forex: www.myshoppingsite/category/shoe/product/nike132032<br><br>
       If a customer wants to share the product using the above link, this could be really annoying due to the excessive character length of the URL. <br><br>
       Below are listed some of the problems due to this: <br><br>
       1. Can’t remember the URL easily <br><br>
       2. Can’t use the links where there are restrictions on text length Ex. Twitter. <br><br>
       The best solution to overcome this issue is by shortening these URLs <br><br>
       Forex: www.myshoppingsite/category/shoe/product/nike132032 to www.myshoppingsite/SdfsS 
       </p>
</div>

<br>
Building a custom URL shortening service like bitly.com using Koa and PostgreSQL

## Technologies

- ### Back end

  - [Koa](https://koajs.com/)- Nodejs framwork for building the REST Apis
  - [Koa-static](https://koajs.com/)- for static files
  - [Koa-views](https://koajs.com/)- for using Pug
  - [Koa-bodyparser](https://koajs.com/)- for post routes
  - [Dotenv](https://github.com/motdotla/dotenv#readme)- for private data
  - [PostgreSQL](http://mongodb.com/)- SQL database
  - [Shortid](https://github.com/dylang/shortid#readme)- id generator
  - [Valid-url](https://github.com/ogt/valid-url)- URI validation functions
  - [Geoip-lite](https://github.com/bluesmoon/node-geoip)- information about client ip address
  - [Argon2](https://github.com/ranisalt/node-argon2#readme)- hash password
  - [@hapi/joi](https://github.com/hapijs/joi#readme)- user validation
  - [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme)- authorization with tokens

- ### Front end

  - 

## ☑ TODO

- [ ] Redirection entity has params - countrycode, device type, redirection type, url to redirect, shorturl
  - [ ] country code obtained via geoip from request.ip
  - [ ] device type obtained from useragent srting via [uaparser](http://faisalman.github.io/ua-parser-js/) (mobile, desktop, ios, android)
  - [ ] redirection type coud be
      - [ ] 301 http status plus location
      - [ ] 302 http status plus location
      - [ ] [meta tag redirect](https://www.w3.org/TR/WCAG20-TECHS/H76.html)
      - [ ] js redirect
- [ ] each shourt url coud have unlimited list of redirect url with different conditins and one fallback redirection if non of conditions met
- [ ] user should be able to see statisctics on each link and conditions fired in it
- [ ] empty project should be inited with db, if tables are not precent in it
- [ ] no publicip, ngrock etc packs in server code
- [X] User authorization. Primarily about registration, so I'll use "@hapi/joi" module for validation email and password, and "argon2" module to hash password, if everything correct I'll sent all data to database. Now about logIn, here we will use the same validation as in registration and verify password hash with "argon2"
- [x] Use JWT authorization. After validation in logIn function we will use "jsonwebtoken" module, so everything we need is create a token and sent this token to headers. Then in private route we will check if token exists we will give access if not access will be denied.
- [ ] Log out. Now I'm not really sure how to do this
## License

MIT
