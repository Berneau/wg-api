let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TaskSchema = new Schema({
  title: { type: String, required: true },
  reporterId: { type: String, required: true },
  assigneeId: { type: String },
  note: { type: String },
  dueTo: { type: Date },
  categoryId: { type: String },
  deleted: { type: Boolean, default: false }
})

module.exports = mongoose.model('Task', TaskSchema)
