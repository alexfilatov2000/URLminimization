const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USSER,
    host: process.env.DB_HOST,
    database: 'url',
});

pool.connect();

pool.query(`
    do $$
    begin
        call transfer();
    end
    $$;`);

module.exports = pool;

// const { Pool } = require('pg');
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });
//
// pool.connect();
//
// module.exports = pool;
