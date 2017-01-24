import winston from 'winston';

winston.level = process.env.LOG_LEVEL || 'debug';

const logger = winston;
export default logger;
