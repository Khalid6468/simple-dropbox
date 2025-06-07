const { Pool } = require('pg');

// Create a lazily-initialised PostgreSQL connection pool (pg)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/filedb',
    user: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'filedb',
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || 'localhost',
});

// Create the files table if it doesn't exist
pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database.');
    const query = `
        CREATE TABLE IF NOT EXISTS files (
            id SERIAL PRIMARY KEY,
            originalname TEXT,
            filename TEXT,
            mimetype TEXT,
            size INTEGER
        );
    `;
    pool.query(query).catch(err => console.error('Error creating table:', err.stack));
});

module.exports = {
    query: (text, params) => pool.query(text, params),
}; 