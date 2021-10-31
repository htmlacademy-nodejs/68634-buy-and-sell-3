"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, searchService) => {

  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    if (!req.query.query) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(`Search query was not found`);
    }

    const suitableOffers = searchService.findAll(req.query.query);

    return res.status(HttpCode.OK)
      .json(suitableOffers);
  });

};
