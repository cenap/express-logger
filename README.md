# express-logger
A properly configured winston (+morgan) logger example

Please check utils/logger.js

**Usage:**

> var logger = require("./utils/logger")('[your module name]');
> var log = logger.log;

> log.debug("Overriding 'Express' logger");
> app.use(morganlogger('combined', { "stream": logger.stream }));
> log.info('Some info'); log.error('Some error');
