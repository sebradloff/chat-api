import pg from 'pg';
import pgConString from 'pg-connection-string';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost/test_db";
const options = pgConString.parse(DATABASE_URL);

// needed to connect to heroku heroku postgresql instance
if (process.env.NODE_ENV === 'production') {
  options.ssl = true;
}
const PgPool = new pg.Pool(options);

export default PgPool;
