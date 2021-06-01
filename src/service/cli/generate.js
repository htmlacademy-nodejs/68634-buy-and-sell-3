"use strict";

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {getRandomInt, shuffleArray, getArrayRandomElement} = require(`../../utils`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;
const MAX_COMMENTS = 4;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const FILE_TITLES_PATH = path.join(__dirname, `../../../data/titles.txt`);
const FILE_SENTENCES_PATH = path.join(__dirname, `../../../data/sentences.txt`);
const FILE_CATEGORIES_PATH = path.join(__dirname, `../../../data/categories.txt`);
const FILE_COMMENTS_PATH = path.join(__dirname, `../../../data/comments.txt`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.split(`\n`);
  } catch (err) {
    throw new Error(`Отсутствует файл или папка по пути: '${err.path}'`);
  }
};

const getPictureFileName = (num) => `item${String(num).padStart(2, `0`)}.jpg`;

const generateCategory = (count, allCategories) => {
  const categories = [];
  const copy = allCategories.slice();
  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomInt(0, copy.length - 1);
    categories.push(copy.splice(randomIndex, 1)[0]);
  }
  return categories;
};

const generateComments = (count, allComments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffleArray(allComments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffer = ({titles, sentences, categories, comments}) => ({
  title: getArrayRandomElement(titles),
  picture: getPictureFileName(
      getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
  ),
  description: shuffleArray(sentences).slice(0, getRandomInt(1, 5)).join(` `),
  type: Object.keys(OfferType)[
    Math.floor(Math.random() * Object.keys(OfferType).length)
  ],
  sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  id: nanoid(MAX_ID_LENGTH),
  category: generateCategory(getRandomInt(1, 3), categories),
  comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
});

const generateOffers = (count, mocks) => (
  Array(count).fill({}).map(() => generateOffer(mocks))
);


module.exports = {
  name: `--generate`,
  async run(args) {
    let mocks = null;
    try {
      mocks = {
        titles: await readContent(FILE_TITLES_PATH),
        categories: await readContent(FILE_CATEGORIES_PATH),
        sentences: await readContent(FILE_SENTENCES_PATH),
        comments: await readContent(FILE_COMMENTS_PATH),
      };
    } catch (err) {
      console.error(chalk.red(err.message));
      process.exit(ExitCode.fail);
    }

    const [count] = args;
    let offerCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    offerCount = offerCount <= 0 ? DEFAULT_COUNT : offerCount;
    if (offerCount > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} объявлений`));
      process.exit(ExitCode.fail);
    }
    const content = JSON.stringify(generateOffers(offerCount, mocks));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Операция выполнена. Файл создан.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Не удалось записать данные в файл...`));
      process.exit(ExitCode.fail);
    }
  },
};
