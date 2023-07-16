const express = require('express');
var async = require('async');
const router = express.Router();

const Utilizador = require("../models/utilizador");
const Game = require("../models/game");
const Rating = require("../models/rating");
//const Wishlist = require("../models/wishlistItem");
const utilizadorController = require("../controllers/utilizadorController");
const buyController = require("../controllers/buyController");
const wishlistController = require("../controllers/wishlistController");


const ratingController = require("../controllers/ratingController");
const gameController = require("../controllers/gameController");
const utilizador = require('../models/utilizador');

router.get('/', function (req, res, next) {
  res.json('Pagina Inicial');
});
/// GAME ROUTES /// 

//GET request for getting all heroes.
router.get("/game/", gameController.getGamesByName);
router.get('/games', gameController.getGames);
router.get('/game/:id', gameController.getGameById);

router.post('/game/:id/rating', ratingController.createRating);
router.post('/rating/:id/opinion', ratingController.createOpinion);
router.put('/game/:id', gameController.updateGame);
router.get('/rating/:id', ratingController.getRatingById);
router.get('/opinion/:id', ratingController.getOpinionById);
router.put('/rating/:id', ratingController.updateRating);

router.get('/utilizador', utilizadorController.findUtilizador);
router.get('/utilizadores', utilizadorController.getAllUsers);
router.post('/utilizador/:id/game', buyController.addBuy);
router.get('/utilizador/:id/buys', buyController.getBuy);
// adiciona essas rotas no seu router
router.get('/utilizador/:userId/following', utilizadorController.getFollowingList);

//nova rota para followers
router.get('/utilizador/:userId/followers', utilizadorController.getFollowersList);
//router.get('/utilizador/:userId', utilizadorController.getUserList);

router.post('/utilizador', utilizadorController.createUtilizador);
router.get('/utilizador/:name/:password', utilizadorController.findUtilizador);
router.get('/utilizadores/:name', utilizadorController.findUtilizadorByName);
router.get('/search/:name', utilizadorController.searchUtilizador);
router.get('/utilizador/:id', utilizadorController.findById);

//editar perfil
router.put('/utilizador/:userId/username', utilizadorController.updateUsername);
router.put('/utilizador/:userId/imageProfile', utilizadorController.updateImageProfile);
//
router.post('/utilizador/:loggedUserId/following/:userId', utilizadorController.followUser);
router.delete('/utilizador/:loggedUserId/following/:userId', utilizadorController.unfollowUser);
router.get('/utilizador/:loggedUserId/wishlist/get', wishlistController.getWishlistItems);
router.post('/utilizador/wishlistadd/:loggedUserId', wishlistController.addGameToWishlist);
router.delete('/utilizador/:loggedUserId/wishlist/remove/:gameId', wishlistController.removeGameFromWishlist);


router.post('/update-cart/:id', async (req, res) => {
  const gameId = req.body.gameId;
  const quantity = req.body.quantity;

  const user = await Utilizador.findById(req.params.id);

  let cartItem = user.cart.find(item => item.game.toString() === gameId.toString());

  if (cartItem !== undefined) {
    // If the item already exists in the cart, update the quantity
    cartItem.quantity += quantity;
    console.log('Quantity updated:', cartItem);
  } else {
    // If the item doesn't exist in the cart, create a new item and add it to the cart
    cartItem = { game: gameId, quantity: quantity };
    user.cart.push(cartItem);
  }

  await user.save();
  res.send(user);
});

router.patch('/update-cart-item/:userId/:gameId', async (req, res) => {
  const { userId, gameId } = req.params;
  const { isGift, recipientId } = req.body;

  try {
    const user = await Utilizador.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(gameId);
    const cartItemIndex = user.cart.findIndex(item => {
      console.log("I", item);
      const found = item.game.toString() === gameId;
      
      console.log('Found Cart Item:', item);
      
      return found;
    });

    const cartItem = user.cart[cartItemIndex];
    cartItem.isGift = isGift;
    cartItem.recipientId = recipientId;
    await user.save();
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/update-cart-item/:userId/:gameId', async (req, res) => {
  const { userId, gameId } = req.params;
  const { quantity } = req.body;

  try {
    const user = await Utilizador.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(item => item.game.toString() === gameId);
    if (cartItem) {
      cartItem.quantity = quantity;
    }

    await user.save();
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/cart/:id', async (req, res) => {
  const user = await Utilizador.findById(req.params.id);
  console.log(user.cart);
  res.send(user.cart);
});

router.delete('/remove-from-cart/:userId/:gameId', async (req, res) => {
  const { userId, gameId } = req.params;
  console.log('userId:', userId);
  console.log('gameId:', gameId);

  const user = await Utilizador.findById(userId);
  console.log('user:', user);
  if (!user) {
    return res.status(404).send('User not found');
  }

  const cartItemIndex = user.cart.findIndex(item => item.game.toString() === gameId);
  console.log('cartItemIndex:', cartItemIndex);
  if (cartItemIndex === -1) {
    return res.status(404).send('Game not found in cart');
  }

  user.cart.splice(cartItemIndex, 1);
  
  // Check the document's version before saving
  if (user.__v !== undefined) {
    user.increment(); // Increment the version to avoid VersionError
  }
  
  await user.save();

  console.log('Cart cleared:', user.cart);
  res.send(user.cart);
});

router.delete('/clear-cart/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('userId:', userId);

  const user = await Utilizador.findById(userId);
  console.log('user:', user);
  if (!user) {
    return res.status(404).send('User not found');
  }

  user.cart = [];
  await user.save();

  console.log('Cart cleared:', user.cart);
  res.send(user.cart);
});

router.get('/utilizadorGetNotifications/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await Utilizador.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    } else {
      res.status(200).json(user.notifications);
    }
  } catch (error) {
    console.log("testing");
    console.error(error);
    res.status(500).send({ message: 'Error retrieving notifications.' });
  }
});

router.delete('/utilizadorDeleteNotification/:userId/:notificationId', async (req, res) => {
  const { userId, notificationId } = req.params;

  try {
    // Find the user
    const user = await Utilizador.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    } else {
      // Remove the notification
      user.notifications.id(notificationId).remove();
      // Save the user
      await user.save();
      res.status(200).send({ message: 'Notification removed.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error removing notification.' });
  }
});const mongoose = require('mongoose');

router.post('/utilizadorAddNotification/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { message } = req.body;

  try {
    const user = await Utilizador.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    } else {
      const notification = {
        message,
        _id: mongoose.Types.ObjectId() // Generate a new ObjectId
      };

      user.notifications.push(notification);

      // Save the user
      await user.save();

      res.status(200).send({ message: 'Notification added.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding notification.' });
  }
});



router.get('/init', async function (req, res, next) {

  await Game.deleteMany({});
  await Rating.deleteMany({});
  await Utilizador.deleteMany({});
  // await Wishlist.deleteMany({});

  // Initialize games collections with predefined values
  const games = [
    new Game({
      name: "Minecraft",
      game_type: "Game",
      description: "A building game where the player can create and explore their own virtual world",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 23.95,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1PdRUzDTjG_Pm6KDYrcbzyxv2S-bUZt0U",
        additional: ["https://drive.google.com/uc?id=1EdNrCJ6EEcnhVJedBQP6t6sjKNLp15xY", "https://drive.google.com/uc?id=1VeBsqw_3vU0CYVzW-LAWlx5vH-_Gg-Mp"],
        video: "https://www.youtube.com/watch?v=MmB9b5njVbA",
      }
    }),
    new Game({
      name: "AmongUs",
      game_type: "Game",
      description: "A multiplayer game where players work together to find an imposter on a spaceship",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 21.30,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1Qab_nTGDYd7HqiuQqk0Wc4H5XthhObqC",
        additional: ["https://drive.google.com/uc?id=1856eKMM4GK0hUQM5EtdHgbLpCdHJlTBO", 
        "https://drive.google.com/uc?id=1IUS2ydyHaq6BOem2NRvICsj0NjQTFceS"],
        video: "https://www.youtube.com/watch?v=9pyYq9lpjls",
      }
    }),
    new Game({
      name: "Animal Crossing",
      game_type: "Game",
      description: "A life simulation game where the player manages an island and interacts with animal characters",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 10.25,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=18CVKasoZbxn3LZGqxCkL5KTdRYkIWVNN",
        additional: [],
        video: "https://www.youtube.com/watch?v=_3YNL0OWio0",
      }
    }),
    new Game({
      name: "Call of Duty",
      game_type: "DLC",
      description: "A free-to-play multiplayer first-person shooter set in a modern war scenario",
      platform: "XBOX ONE",
      idioms: ["Portuguese", "English"],
      price: 40.99,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1KxqEN_Hz8YJPzZ4MLKktU0nvniteLLC7",
        additional: [],
        video: null,
      }
    }),
    new Game({
      name: "Sims 4",
      game_type: "subscription",
      description: "A life simulation game where the player can create and manage virtual characters and their daily lives.",
      platform: "PS5",
      idioms: ["Portuguese", "English"],
      price: 19.99,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1QG3EEBVV4g3oAPW_-scHYOjoCpWSnNau",
        additional: [],
        video: "https://www.youtube.com/watch?v=GJENRAB4ykA",
      }
    }),
    new Game({
      name: "Monopoly",
      game_type: "subscription",
      description: "A board game where players compete to build properties and be the last one standing.",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 58.70,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1XH05IneswY5zg2JYrLZ8Cc7CpB53XVHI",
        additional: ["https://drive.google.com/uc?id=1H5i0Z8iqIGN-vZqrPYjP49B1mieFFJ5a", "https://drive.google.com/uc?id=1Hw1BCSfuU1hHTZXnFFCaZnZpTZeSpkTM"],
        video: null,
      }
    }),
    new Game({
      name: "Trivial Pursuit",
      game_type: "DLC",
      description: "A board game where players answer questions in different game_types of general knowledge",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 20.00,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1O2RGA4oEMJslnJ5eQr2OBorWXtVlghxu",
        additional: ["https://drive.google.com/uc?id=1uJD9o3e4Oeq3ilJWvUId09rkuHTDmx53", "https://drive.google.com/uc?id=1KtpDSQOQhJE0k5DIjBg9FmkwiWCn8Q9L"],
        video: null,
      }
      
    }),
    new Game({
      name: "Dead Space",
      game_type: "Game",
      description: "A third-person horror game where the player is a space engineer on a ship infested with undead creatures.",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 27.79,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1nifytrxJjkGMggc9a26moFtf1zWB0-6-",
        additional: [],
        video: null,
      },

    }),
    new Game({
      name: "Just Dance 2022",
      game_type: "DLC",
      description: "A rhythm game where the player must follow dance steps to popular music to earn scores",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 15.95,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1ooQcAZmspLELczRG96dv5eSZT2ffFVZ8",
        additional: [],
        video: null,
      },
    }),
    new Game({
      name: "Chess",
      game_type: "DLC",
      description: "A classic board game where players must move their pieces to capture the opponent's king",
      platform: "PC",
      idioms: ["Portuguese", "English"],
      price: 9.99,
      avarageRating: 0,
      ratings: [],
      images: {
        main: "https://drive.google.com/uc?id=1JYZYh3luobULj7x-04T2O4ZzuDYMrHkA",
        additional: [],
        video: null,
      },
    })
  ];

  // Save all games at the data base.
  games.forEach(function (games) { games.save(); });

  const users = [
    new utilizador({name: "admin",password: "admin", imageProfile: "https://drive.google.com/uc?id=1OS9sQQDDz6DcgpuIsgza6_HbJMRxj8oo"}),   
    new utilizador({name: "admin2",password: "admin2"}),
    new utilizador({name: "admin3",password: "admin3"}),  
    new utilizador({name: "admin4",password: "admin4"})
  ];

  users.forEach(function (users) { users.save(); });
  res.status(200).send('Data base successfulley initialized.');
});
module.exports = router;
