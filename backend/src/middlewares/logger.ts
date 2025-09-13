import fs from 'fs';
import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';

const LOG_DIR = path.resolve('logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const requestTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'request.log'),
  level: 'info',
});

const errorTransport = new winston.transports.File({
  filename: path.join(LOG_DIR, 'error.log'),
  level: 'error',
});

export const requestLogger = expressWinston.logger({
  transports: [requestTransport],
  format: jsonFormat,
  meta: true,
  statusLevels: true,
  requestWhitelist: [
    'url', 'method', 'httpVersion', 'originalUrl', 'query', 'headers', 'body',
  ],
  responseWhitelist: ['statusCode', 'responseTime'],
});

export const errorLogger = expressWinston.errorLogger({
  transports: [errorTransport],
  format: jsonFormat,
});
