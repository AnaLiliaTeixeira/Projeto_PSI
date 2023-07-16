const Game = require("../models/game");

exports.getGames = async (req, res, next) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    next(err);
  }
};

exports.getGamesByName = async (req, res) => {
  try {
    const name = req.query.name.toLowerCase();
    const games = await Game.find();
      const gamesByName = games.filter(game => game.name.toLowerCase().includes(name));
      res.send(gamesByName);
  } catch (error) {
    console.error(`Error searching for games: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getGameById = async (req, res, next) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};

exports.updateGame = async (req, res, next) => {
  const gameId = req.params.id;
  const game = req.body;

  try {
    const updatedGame = await Game.findByIdAndUpdate(gameId, game, { new: true });
    res.status(200).json(updatedGame);
  } catch (error) {
    console.error(`Error updating game: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};