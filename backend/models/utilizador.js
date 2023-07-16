const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const utilizador = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [
        {
          game: {type: Schema.Types.ObjectId, required: false, ref: "Game"},
          quantity: {type: Number, required: false, default: 0},
          isGift: { type: Boolean, required: false, default: false },
          recipientId: { type: Schema.Types.ObjectId, required: false, ref: 'User' }
        }
    ],
    buys: [{type: Schema.Types.ObjectId, required: false,ref: "Buy"}],
    following: [{type: Schema.Types.ObjectId, required: false,ref: "Utilizador"}],
    followers: [{type: Schema.Types.ObjectId, required: false,ref: "Utilizador"}],
    wishlist: [{type: Schema.Types.ObjectId, required: false,ref: "Game"}],
    imageProfile: {
        type: String,
        required: false
    },
    notifications: [{
        _id: {type: Schema.Types.ObjectId, auto: true},
        message: { type: String, required: true }}]
});

module.exports = mongoose.model('Utilizador', utilizador);