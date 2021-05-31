"use strict";

const express = require(`express`);

const app = express();
app.use(express.json());

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;
const apiRoutes = require(`../api`);

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    let port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    port = (port <= 0) ? DEFAULT_PORT : port;

    app.use(API_PREFIX, apiRoutes);
    app.listen(port);
  }
};
