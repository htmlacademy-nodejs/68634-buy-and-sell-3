"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffleArray, getArrayRandomElement} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [`Книги`, `Разное`, `Посуда`, `Игры`, `Животные`, `Журналы`];

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

const getPictureFileName = (num) => `item${String(num).padStart(2, `0`)}.jpg`;

const generateCategory = (count) => {
  const categories = [];
  const copy = CATEGORIES.slice();
  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomInt(0, copy.length - 1);
    categories.push(copy.splice(randomIndex, 1)[0]);
  }
  return categories;
};

const generateOffer = () => ({
  title: getArrayRandomElement(TITLES),
  picture: getPictureFileName(
      getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
  ),
  description: shuffleArray(SENTENCES).slice(0, getRandomInt(1, 5)).join(` `),
  type: Object.keys(OfferType)[
    Math.floor(Math.random() * Object.keys(OfferType).length)
  ],
  sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  category: generateCategory(getRandomInt(1, 3)),
});

const generateOffers = (count) => Array(count).fill({}).map(generateOffer);


module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Операция выполнена. Файл создан.`));
      process.exit(0);
    } catch (err) {
      console.error(chalk.red(`Не удалось записать данные в файл...`));
      process.exit(1);
    }
  },
};
