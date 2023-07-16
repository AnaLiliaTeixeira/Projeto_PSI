const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ratingSchema = new mongoose.Schema({
  rank: { type: Number, required: true },
  message: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return v.length <= 5000;
      },
      message: 'A mensagem da classificação deve ter no máximo 5000 caracteres.'
    }
  },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  user: {type: Schema.Types.ObjectId, ref: "Utilizador" , required: true },
  opinion:[{type: Schema.Types.ObjectId, ref: "Opinion" , required: false }]
});


module.exports = mongoose.model('Rating', ratingSchema);
