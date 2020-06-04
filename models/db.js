const { Pool } = require('pg');

const pool = new Pool({
    user: 'alex__filatov',
    host: 'localhost',
//     use env to get settings
    database: 'url'
});

pool.connect();

module.exports = pool;

// const { Pool } = require('pg');
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });
//
// module.exports = pool;
