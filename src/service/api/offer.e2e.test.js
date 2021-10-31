"use strict";

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);


const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "title": `Продам шторы с геометрическим узором`,
    "picture": `item01.jpg`,
    "description": `Это настоящая находка для коллекционера! Звонить только в светлое время суток! Товар в отличном состоянии. Если товар не понравится — верну всё до последней копейки. Бонусом отдам все аксессуары.`,
    "type": `SALE`,
    "sum": 74388,
    "id": `8qbV_X`,
    "category": [
      `Животные`,
      `Электроника`,
      `Журналы`
    ],
    "comments": [
      {
        "id": `yijg8q`,
        "text": `Неплохо, но дорого `
      },
      {
        "id": `D23h0K`,
        "text": `А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    "title": `Куплю "Марсианские хроники" Р.Бредбери`,
    "picture": `item05.jpg`,
    "description": `Звонить только в светлое время суток! Продаю с болью в сердце... Таких предложений больше нет! Если найдёте дешевле — сброшу цену.`,
    "type": `OFFER`,
    "sum": 67401,
    "id": `h2ShRB`,
    "category": [
      `Строительство и ремонт`,
      `Разное`
    ],
    "comments": [
      {
        "id": `A6zt2k`,
        "text": `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. `
      },
      {
        "id": `-g2ihU`,
        "text": `А где блок питания? А сколько игр в комплекте?`
      },
      {
        "id": `6uu0fg`,
        "text": `Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "title": `Продам библиографию Н.В.Гоголя`,
    "picture": `item05.jpg`,
    "description": `При покупке с меня бесплатная доставка в черте города. Товар в отличном состоянии.`,
    "type": `SALE`,
    "sum": 24258,
    "id": `3lG4Aj`,
    "category": [
      `Мебель/предметы интерьера`,
      `Животные`
    ],
    "comments": [
      {
        "id": `OgsyLh`,
        "text": `А где блок питания?  Оплата наличными или перевод на карту?`
      },
      {
        "id": `KjiIrv`,
        "text": `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    "title": `Продам шторы с геометрическим узором`,
    "picture": `item09.jpg`,
    "description": `Если товар не понравится — верну всё до последней копейки. Готов рассмотреть вариант обмена.`,
    "type": `SALE`,
    "sum": 35663,
    "id": `JyhI-a`,
    "category": [
      `Антиквариат`,
      `Животные`,
      `Бытовые приборы`
    ],
    "comments": [
      {
        "id": `7uxtOB`,
        "text": ` Оплата наличными или перевод на карту? Неплохо, но дорого`
      }
    ]
  },
  {
    "title": `Продам шторы с геометрическим узором`,
    "picture": `item14.jpg`,
    "description": `Таких предложений больше нет! При покупке с меня бесплатная доставка в черте города. Продаю срочно, сделаю хорошую скидку. Даю недельную гарантию. Продаю с болью в сердце...`,
    "type": `SALE`,
    "sum": 49588,
    "id": `7FsESR`,
    "category": [
      `Журналы`,
      `Книги`,
      `Посуда`
    ],
    "comments": [
      {
        "id": `W4c15l`,
        "text": `Вы что?! В магазине дешевле.`
      },
      {
        "id": `rHD6bX`,
        "text": `Почему в таком ужасном состоянии? Неплохо, но дорого`
      },
      {
        "id": `ay7nt_`,
        "text": `Совсем немного...`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new OfferService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First offer's id equals "8qbV_X"`, () => expect(response.body[0].id).toBe(`8qbV_X`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/h2ShRB`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Куплю "Марсианские хроники" Р.Бредбери"`, () => expect(response.body.title).toBe(`Куплю "Марсианские хроники" Р.Бредбери`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Offer count is 5 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/3lG4Aj`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offer is really changed`, () => request(app)
    .get(`/offers/3lG4Aj`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();

  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/7FsESR`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`7FsESR`));

  test(`Offer count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/8qbV_X/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));

  test(`First comment's id is "yijg8q"`, () => expect(response.body[0].id).toBe(`yijg8q`));
  test(`Second comment's id is "D23h0K"`, () => expect(response.body[1].id).toBe(`D23h0K`));

});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers/8qbV_X/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed. It is equals 3 now`, () => request(app)
    .get(`/offers/8qbV_X/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/offers/h2ShRB/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/3lG4Aj/comments/OgsyLh`);
  });

  test(`Status code 204`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`OgsyLh`));

  test(`Comments count is 1 now`, () => request(app)
    .get(`/offers/3lG4Aj/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );

});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/3lG4Aj/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST/comments/KjiIrv`)
    .expect(HttpCode.NOT_FOUND);
});
