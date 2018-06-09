let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategorySchema = new Schema({
  title: { type: String, required: true },
  color: { type: String },
  icon: { type: String },
  note: { type: String },
  deleted: { type: Boolean, default: false }
})

module.exports = mongoose.model('Category', CategorySchema)
