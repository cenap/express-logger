const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
require('dotenv').config();
require('winston-mongodb').MongoDB;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const wrapper = function (lbl = '') {
  let logger = createLogger({
    transports: [
      new transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: combine(colorize(), label({ label: lbl }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
      })
    ],
    exitOnError: false // do not exit on handled exceptions
  });

  if (process.env.LOG_TO_DB === 'yes') {
    // console.log('Logging to DB');
    logger.add(new transports.MongoDB({
      db: process.env.MONGO_URL,
      handleExceptions: true,
      collection: 'logs',
      level: 'info',
      capped: true,
      label: lbl,
      options: {useUnifiedTopology: true}
    }));
  }

  if (process.env.LOG_TO_FILES === 'yes') {
    const errorLogFile = process.env.ERROR_LOG_FILE || 'error.log';
    const appLogFile = process.env.APP_LOG_FILE || 'app.log';

    // console.log('Logging to files. App: "' + appLogFile + '" - Error:"' + errorLogFile + '"');
    logger.add(new transports.File({
      level: 'info',
      filename: appLogFile,
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), label({ label: lbl }), logFormat)
    }));

    logger.add(new transports.File({
      level: 'error',
      filename: errorLogFile,
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), label({ label: lbl }), logFormat)
    }));
  }

  let stream = {
    write: function (message, encoding) {
      logger.info(message);
    }
  };

  return { log: logger, stream: stream };
};

module.exports = wrapper;
