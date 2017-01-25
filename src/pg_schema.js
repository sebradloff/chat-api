import PgPool from './PgPoolConfig';
import logger from './Logger';

PgPool.connect((err, client, done) => {
  if (err) logger.error('error fetching client from pool', err);

  client.query('CREATE SCHEMA IF NOT EXISTS chat_api;',
            [],
          (error) => {
            if (error) logger.log('error', error);
            logger.log('info', 'Successfully created schema');
  });

  client.query('CREATE EXTENSION "pgcrypto";',
            [],
          (error) => {
            if (error) logger.log('error', error);
            logger.log('info', 'Successfully added pgcrypto extension');
  });

  client.query('CREATE TABLE IF NOT EXISTS chat_api.user (' +
                'id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),' +
                'name TEXT NOT NULL' +
              ');',
            [],
          (error) => {
            if (error) logger.log('error', error);
            logger.log('info', 'Successfully created user table');
  });

  client.query('CREATE TABLE IF NOT EXISTS chat_api.message (' +
                'id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),' +
                'contents TEXT NOT NULL,' +
                'date_sent TIMESTAMP NOT NULL DEFAULT NOW(),' +
                'sender_id UUID NOT NULL,' +
                'receiver_id UUID NOT NULL' +
              ');',
            [],
          (error) => {
            if (error) logger.log('error', error);
            logger.log('info', 'Successfully created message table');
  });

  done();
});
