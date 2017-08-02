var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LanguageSchema = new Schema({
    name: { type: String, require: true },
    categories: [{}],
    dateModified: { type: Date, default: Date.now },
    status: String,
    deleted: {type: Boolean, default: false }
}, {
    strict: true,
    safe: true
});

LanguageSchema.set('toJSON', {
	virtuals: true
});

LanguageSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Language', LanguageSchema);