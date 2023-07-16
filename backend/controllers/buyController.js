const Utilizador = require('../models/utilizador');
const Buy = require('../models/buy');


exports.addBuy = async function (req, res, next) {
  try {
    const user = await Utilizador.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const game = req.body.game;
    const buy = new Buy({
      game: game,
      date: new Date()
    });

    const newBuy = await buy.save();

    user.buys.push(newBuy);

    await user.save();

    res.status(201).json(newBuy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getBuy = async function (req, res, next) {
  try {
    const user = await Utilizador.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const buys = await Buy.find({ _id: { $in: user.buys } });
    res.json(buys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

