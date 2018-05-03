let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let InvoiceSchema = new Schema({
  ownerId: { type: String, required: true },
  amountOriginal: { type: Number, default: 0 },
  amountPrivate: { type: Number, default: 0 },
  amountToSplit: { type: Number, default: 0 },
  month: { type: Number },
  year: { type: Number },
  date: { type: Date },
  deleted: { type: Boolean, default: false }
})

module.exports = mongoose.model('Invoice', InvoiceSchema)
