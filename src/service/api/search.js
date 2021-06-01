"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, searchService) => {

  app.use(`/search`, route);

  route.get(`/`, (req, res) => {

    const suitableOffers = searchService.findAll(req.query.query);

    return res.status(HttpCode.OK)
      .json(suitableOffers);
  });

};
