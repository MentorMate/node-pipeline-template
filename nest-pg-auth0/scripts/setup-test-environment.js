/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

const setupTestEnv = async () => {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.test'),
    override: true,
  });

  try {
    console.log('Creating test database..');
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      // Using default database name to create the connection
      database: 'postgres',
    });

    const client = await pool.connect();

    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datName = $1',
      [`${process.env.PGDATABASE}`],
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${process.env.PGDATABASE}"`);
      console.log('Test database created!');
    } else {
      console.log('Test database already exists!');
    }

    client.release();
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

(async () => {
  await setupTestEnv();
  process.exit(0);
})();
