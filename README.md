# basic-node-logger

[![NPM version](https://badge.fury.io/js/basic-node-logger.svg)](https://www.npmjs.com/package/basic-node-logger)

A basic logger for Node.js applications that was influenced by the standard logging in Java-Spring.

## Installation

```bash
npm install basic-node-logger
```

## How to use

Simply create a logger instance and use it to log messages at various levels optionally including custom configuration and/or supplying a request ID.

```typescript
import { BasicLogger } from "basic-node-logger";

const logger = new BasicLogger({
  name: "myApp",
  logLevel: "TRACE",
});

logger.fatal("This is a fatal message");
logger.error("This is an error message");
logger.warn("This is a warning message");
logger.info("This is an info message");
logger.debug("This is a debug message");
logger.trace("This is a trace message");
```

The output of the above commands will look like this:

![Screenshot of a terminal outputting log messages at various levels.](/image.png)
