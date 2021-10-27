"use strict";

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const CategoryService = require(`../data-service/category`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "title": `Куплю "Марсианские хроники" Р.Бредбери`,
    "picture": `item09.jpg`,
    "description": `Если товар не понравится — верну всё до последней копейки. Если найдёте дешевле — сброшу цену. Это настоящая находка для коллекционера! Даю недельную гарантию. Продаю срочно, сделаю хорошую скидку.`,
    "type": `SALE`,
    "sum": 59665,
    "id": `-7y01s`,
    "category": [
      `Разное`,
      `Мебель/предметы интерьера`,
      `Электроника`
    ],
    "comments": [
      {
        "id": `-GIM_d`,
        "text": `Совсем немного...`
      },
      {
        "id": `5aZK1r`,
        "text": ``
      },
      {
        "id": `SfUF2E`,
        "text": `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Совсем немного...`
      }
    ]
  },
  {
    "title": `Продам шторы с геометрическим узором`,
    "picture": `item11.jpg`,
    "description": `Таких предложений больше нет! Даю недельную гарантию. Доставка курьером в пределах города за мой счет.`,
    "type": `OFFER`,
    "sum": 24022,
    "id": `aAaTOe`,
    "category": [
      `Антиквариат`
    ],
    "comments": [
      {
        "id": `k8qcR0`,
        "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого`
      },
      {
        "id": `WBbw9_`,
        "text": `Совсем немного...`
      },
      {
        "id": `3beSJY`,
        "text": `Оплата наличными или перевод на карту? Неплохо, но дорого `
      },
      {
        "id": `Gkjsjy`,
        "text": `Почему в таком ужасном состоянии?  Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    "title": `Продам новую приставку Sony Playstation 5`,
    "picture": `item12.jpg`,
    "description": `Готов рассмотреть вариант обмена.`,
    "type": `OFFER`,
    "sum": 21454,
    "id": `_3XrnJ`,
    "category": [
      `Книги`
    ],
    "comments": [
      {
        "id": `VwjQG-`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?`
      },
      {
        "id": `lhiDrw`,
        "text": `Вы что?! В магазине дешевле.`
      },
      {
        "id": `VYkwJR`,
        "text": ` Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "title": `Продам напольную шведскую стенку`,
    "picture": `item07.jpg`,
    "description": `Если товар не понравится — верну всё до последней копейки.`,
    "type": `SALE`,
    "sum": 21751,
    "id": `WBdvSw`,
    "category": [
      `Посуда`,
      `Игры`,
      `Книги`
    ],
    "comments": [
      {
        "id": `yh9nrh`,
        "text": `Оплата наличными или перевод на карту?`
      },
      {
        "id": `aenyrn`,
        "text": `Неплохо, но дорого А где блок питания? Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    "title": `Куплю аквариум`,
    "picture": `item06.jpg`,
    "description": `Продаю срочно, сделаю хорошую скидку. Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Готов рассмотреть вариант обмена.`,
    "type": `OFFER`,
    "sum": 25554,
    "id": `6cu89y`,
    "category": [
      `Игры`
    ],
    "comments": [
      {
        "id": `tZFXxr`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `TjDLkh`,
        "text": `А сколько игр в комплекте? Вы что?! В магазине дешевле.`
      },
      {
        "id": `zY-j7u`,
        "text": `Вы что?! В магазине дешевле.`
      }
    ]
  }
];

const app = express();
app.use(express.json());
category(app, new CategoryService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 7 categories`, () => expect(response.body.length).toBe(7));

  test(`Category names are "Разное", "Мебель/предметы интерьера", "Электроника", "Антиквариат", "Книги", "Посуда", "Игры"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Разное`, `Мебель/предметы интерьера`, `Электроника`, `Антиквариат`, `Книги`, `Посуда`, `Игры`])
      )
  );
});
