"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer, comment) {
    const newComment = {id: nanoid(MAX_ID_LENGTH), comment};

    offer.comments.push(newComment);
    return newComment;
  }

  drop(offer, commendId) {
    const comment = offer.comments.find((c) => c.id === commendId);

    if (!comment) {
      return null;
    }

    offer.comments = offer.comments.filter((c) => c.id !== commendId);
    return comment;
  }

  findByOfferId(offerId) {
    const {comments} = this._offers.find((offer) => offer.id === offerId);

    return comments;
  }

  findAll() {
    const comments = this._offers.reduce((acc, offer) => {
      offer.comments.forEach((comment) => acc.add(comment));
      return acc;
    }, []);

    return comments;
  }
}

module.exports = CommentService;
