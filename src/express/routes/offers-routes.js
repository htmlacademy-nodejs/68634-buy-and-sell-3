"use strict";

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/category`, (req, res) => res.render(`offers/category`));
offersRouter.get(`/add`, (req, res) => res.render(`offers/new-ticket`));
offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));
offersRouter.get(`/edit/:id`, (req, res) => res.render(`offers/ticket-edit`));

module.exports = offersRouter;
