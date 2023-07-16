const Game = require('../models/game');
const Rating = require('../models/rating');
const Opinion = require('../models/Opinion');

exports.createRating = async function (req, res, next) {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const rating = new Rating({
      rank: req.body.rank,
      message: req.body.message,
      likes:0,
      dislikes:0,
      user: req.body.user,
      opinion:  req.body.opinion,
    });

    const newRating = await rating.save();
    game.ratings.push(newRating);

    let totalRating = 0;
    for (let i = 0; i < game.ratings.length; i++) {
      totalRating += (await Rating.findById(game.ratings[i])).rank;
      
    }
    game.avarageRating = totalRating / game.ratings.length;

    await Game.findByIdAndUpdate(game._id,game);

    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.updateRating = async function (req, res, next) {
  try {
    const rating = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rating) {
      return res.status(404).send();
    }
    res.send(rating);
  } catch (error) {
    res.status(500).send(error);
  }
}
exports.getRatingById = async function (req, res, next) {
  try {
    const ratingId = req.params.id;
    const rating = await Rating.findById(ratingId).exec();

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.status(200).json(rating);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};


exports.createOpinion = async function (req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const opinion = new Opinion({
      user: req.body.user,
      message:  req.body.message,
    });
    const newOpinion = await opinion.save();
    rating.opinion.push(opinion);
    await Rating.findByIdAndUpdate(rating._id,rating);
    res.status(201).json(newOpinion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOpinionById = async function (req, res, next) {
  try {
    const opinionId = req.params.id;
    const opinion = await Opinion.findById(opinionId).exec();

    if (!opinion) {
      return res.status(404).json({ error: 'Opinion not found' });
    }
    res.status(200).json(opinion);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};


