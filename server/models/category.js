var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: { type: String, require: true },
    dateModified: { type: Date, default: Date.now },
    status: String,
    deleted: {type: Boolean, default: false }
}, {
    strict: true,
    safe: true
});

CategorySchema.set('toJSON', {
	virtuals: true
});

CategorySchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Category', CategorySchema);