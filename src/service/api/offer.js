"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exist`);

const route = new Router();

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();

    if (!offers) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with relevant data`);
    }

    return res.status(HttpCode.OK)
        .json(offers);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });

  route.put(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    let offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    offer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK)
      .json(offer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const deletedOffer = offerService.drop(offerId);

    if (!deletedOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Offer with id="${offerId}" wasn't found`);
    }

    return res.sendStatus(HttpCode.NO_CONTENT);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK)
      .json(offer.comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const comment = req.body;

    commentService.create(offer, comment);

    return res.sendStatus(HttpCode.CREATED);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;

    if (!commentService.drop(offer, commentId)) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`There is no such comment in base`);
    }

    return res.sendStatus(HttpCode.NO_CONTENT);
  });
};
