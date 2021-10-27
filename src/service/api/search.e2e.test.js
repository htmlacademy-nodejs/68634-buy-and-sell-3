"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);
const mockData = [
  {
    "title": `Продам шторы с геометрическим узором`,
    "picture": `item01.jpg`,
    "description": `Звонить только в светлое время суток! При покупке с меня бесплатная доставка в черте города.`,
    "type": `OFFER`,
    "sum": 74932,
    "id": `9hANJ4`,
    "category": [
      `Строительство и ремонт`,
      `Журналы`
    ],
    "comments": [
      {
        "id": `wgeaKk`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`
      },
      {
        "id": `D5utWz`,
        "text": `Вы что?! В магазине дешевле. Почему в таком ужасном состоянии? Совсем немного...`
      }
    ]
  },
  {
    "title": `Куплю металлоискатель`,
    "picture": `item16.jpg`,
    "description": `Будьте первыми позвонившими! Готов рассмотреть вариант обмена. Даю недельную гарантию. Пользовались бережно и только по большим праздникам.`,
    "type": `OFFER`,
    "sum": 96780,
    "id": `AmHYkW`,
    "category": [
      `Книги`
    ],
    "comments": [
      {
        "id": `UWIM5W`,
        "text": `Неплохо, но дорого`
      },
      {
        "id": `mdRzaf`,
        "text": `Совсем немного... Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `B3zmTH`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      },
      {
        "id": `7aTtIA`,
        "text": `С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "title": `Продам книги Стивена Кинга`,
    "picture": `item15.jpg`,
    "description": `При покупке с меня бесплатная доставка в черте города. Даю недельную гарантию.`,
    "type": `SALE`,
    "sum": 15763,
    "id": `RENRv6`,
    "category": [
      `Игры`
    ],
    "comments": [
      {
        "id": `IdM9GF`,
        "text": `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту? `
      }
    ]
  },
  {
    "title": `Продам шторы с геометрическим узором`,
    "picture": `item16.jpg`,
    "description": `Это настоящая находка для коллекционера! Бонусом отдам все аксессуары. Со 100% предоплатой отправлю курьерской службой в любой город.`,
    "type": `OFFER`,
    "sum": 89734,
    "id": `-i6IJz`,
    "category": [
      `Игры`,
      `Бытовые приборы`
    ],
    "comments": [
      {
        "id": `6goRLQ`,
        "text": `С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `wFpCpT`,
        "text": `Оплата наличными или перевод на карту? А сколько игр в комплекте?`
      }
    ]
  },
  {
    "title": `Продам напольную шведскую стенку`,
    "picture": `item16.jpg`,
    "description": `При покупке с меня бесплатная доставка в черте города. Если товар не понравится — верну всё до последней копейки. Готов рассмотреть вариант обмена. Продаю срочно, сделаю хорошую скидку.`,
    "type": `OFFER`,
    "sum": 62466,
    "id": `6f_D0C`,
    "category": [
      `Книги`
    ],
    "comments": [
      {
        "id": `lg0ezB`,
        "text": `Неплохо, но дорого`
      },
      {
        "id": `t9DOEo`,
        "text": `С чем связана продажа? Почему так дешёво? Совсем немного...`
      },
      {
        "id": `cz7MNJ`,
        "text": `А где блок питания?`
      },
      {
        "id": `S-ydv3`,
        "text": `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?`
      }
    ]
  }
];


const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам книги Стивена Кинга`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`RENRv6`));
});

test(`API returns 400 when query string is absent`,
    () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);
