var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    description: { type: String, require: true },
    category: { type: String, require: true },
    type: { type: Object },
	extra: { type: String },
    answer: { type: String, require: true },
	time: { type: Number },
    dateModified: { type: Date, default: Date.now },
    status: String,
    deleted: {type: Boolean, default: false }
}, {
    strict: true,
    safe: true
});

QuestionSchema.set('toJSON', {
	virtuals: true
});

QuestionSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Question', QuestionSchema);