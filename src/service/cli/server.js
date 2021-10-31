"use strict";

const express = require(`express`);
const {HttpCode} = require(`../../constants`);

const app = express();
app.use(express.json());

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;
const apiRoutes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    let port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    port = (port <= 0) ? DEFAULT_PORT : port;

    app.use((req, res, next) => {
      logger.error(`(error) Request on route ${req.url}`);
      logger.info(`(info) Request on route ${req.url}`);
      logger.debug(`(debug) Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });

      next();
    });

    app.use(API_PREFIX, apiRoutes);

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occurred on server creation: ${err.message}`);
        }
        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

  }
};
