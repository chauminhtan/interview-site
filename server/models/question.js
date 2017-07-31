var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: { type: String, require: true },
    language: { type: String, require: true },
    category: { type: String, require: true },
    type: { type: String, default: 'text' },
	pickAnswers: [{}],
    answer: { type: String, require: true },
	time: { type: Number, default: 10 },
    dateModified: { type: Date, default: Date.now },
    status:  {type: String, default: '1' },
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