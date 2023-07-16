
const Utilizador = require('../models/utilizador');
const Game = require("../models/game");

exports.addGameToWishlist = async (req, res, next) => {
    try {

        const {loggedUserId} = req.params;
        const user = await Utilizador.findById(loggedUserId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const gameId = req.body.gameId;
        const game = await Game.findById(gameId);
        console.log(gameId);

        user.wishlist.push(game);
        await user.save();

        res.status(200).json({ success: true, message: game.name + ' added successfully to wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ocorreu um erro ao adicionar o item à wishlist' });
    }
};

exports.removeGameFromWishlist = async (req, res, next) => {
    try {
        const {loggedUserId, gameId} = req.params;
        const user = await Utilizador.findById(loggedUserId).populate('wishlist');
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const gameIndex = user.wishlist.findIndex(game => game._id.toString() === gameId);
        if (gameIndex === -1) {
          return res.status(404).json({success: false, error: 'Game not found in wishlist' });
        }
        user.wishlist.splice(gameIndex, 1);

        await user.save();
        // await user.wishlist.findByIdAndRemove(gameId);
        res.status(200).json({ success: true, message: 'Item removido da wishlist com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ocorreu um erro ao remover o item da wishlist' });
    }
};

exports.getWishlistItems = async (req, res, next) => {
    try {
        const {loggedUserId} = req.params;
        const user = await Utilizador.findById(loggedUserId).populate('wishlist');
        console.log("olaaaaa");
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const wishlistItems = user.wishlist;
        res.status(200).json(wishlistItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ocorreu um erro ao obter os itens da wishlist' });
    }
};