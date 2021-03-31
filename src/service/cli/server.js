"use strict";

const fs = require(`fs`).promises;
const express = require(`express`);
const {Router} = require(`express`);
const path = require(`path`);
// const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = path.join(__dirname, `../../../mocks.json`);

const app = express();
app.use(express.json());


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    let port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    port = (port <= 0) ? DEFAULT_PORT : port;

    const routes = new Router();
    routes.get(`/offers`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);

        res.json(mocks);
      } catch (err) {
        // код в соответствии с заданием
        res.send([]);

        // код из учебника, глава с разбором ДЗ (глава 3.12)
        // res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
      }
    });

    app.use(`/`, routes);
    app.listen(port);
  }
};
