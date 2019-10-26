const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const wrapper = function(lbl='') {
  let logger = createLogger({
    transports: [
      new transports.File({
        level: 'info',
        filename: 'app.log',
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), label({ label: lbl }), logFormat),
      }),
      new transports.File({
        level: 'error',
        filename: 'error.log',
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), label({ label: lbl }), logFormat)
      })
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: combine( colorize(), label({ label: lbl }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat )
    }));
  }

  let stream = {
    write: function(message, encoding) {
      logger.info(message);
    }
  };

  return { log:logger, stream: stream };
}

module.exports = wrapper;
