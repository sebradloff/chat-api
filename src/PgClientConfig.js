import pg from 'pg';

const Client = pg.Client;
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost/test_db";

// needed to connect to heroku heroku postgresql instance
if (process.env.NODE_ENV === 'production') {
  pg.defaults.ssl = true;
}

const PgClient = new Client(DATABASE_URL);
PgClient.connect();

export default PgClient;
