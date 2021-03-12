"use strict";

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const path = require(`path`);
const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = path.join(__dirname, `../../../mocks.json`);

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  // console.log(`🖨️ :: onClientConnect :: res`, res);
  // console.log(`🖨️ :: onClientConnect :: req`, req);
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    let port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    port = (port <= 0) ? DEFAULT_PORT : port;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.log(chalk.red(`Ошибка при создании сервера `, err.message));
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
  }
};
