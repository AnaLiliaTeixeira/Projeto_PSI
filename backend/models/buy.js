var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BuySchema = new Schema({
  game: {type: Schema.Types.ObjectId, ref: "Game", required:true},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Buy", BuySchema);