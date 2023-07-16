const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const opinionSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length <= 5000;
      },
      message: 'A mensagem da classificação deve ter no máximo 5000 caracteres.'
    }
  },
  user: {type: Schema.Types.ObjectId, ref: "Utilizador" , required: true }
});


module.exports = mongoose.model('Opinion', opinionSchema);