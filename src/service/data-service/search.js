"use strict";
class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(query) {
    const suitableOffers = this._offers.filter((offer) => offer.title.includes(query));

    return suitableOffers;
  }
}

module.exports = SearchService;
