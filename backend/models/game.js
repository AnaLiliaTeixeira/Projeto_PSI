var mongoose = require("mongoose");


var Schema = mongoose.Schema;

var GameSchema = new Schema({
  name: { type: String, required: true },
  game_type: { type: String, required: true },
  description: { type: String, required: true, maxLength: 1000 },
  platform: { type: String, required: true },
  idioms: [{ type: String, required: true }],
  price: { type: Number, required: true },
  avarageRating: { type: Number, required: true },
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  images: {
    main: { type: String, required: true },
    additional: [{ type: String }],
    video: { type: String }
  },
});

module.exports = mongoose.model("Game", GameSchema);