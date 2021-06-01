
"use strict";

const fs = require(`fs`).promises;
const path = require(`path`);
const FILENAME = path.join(__dirname, `../../../mocks.json`);
let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};

module.exports = {
  getMockData
};
