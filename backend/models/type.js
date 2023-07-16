var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TypeSchema = new Schema({
  type: { type: String, required: true},
});

module.exports = mongoose.model("Type", TypeSchema);