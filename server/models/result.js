var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
    test: { 
        id: String, 
        title: String, 
        time: Number,
        questions: [{ 
            id: String, 
            title: String,
            typeQ: String,
            time: Number,
            pickAnswers: [{}],
            language: String,
            category: String,
        }],
    },
    point: { type: Number, default: 0 },
	time: { type: Number, default: 0 },
    dateModified: { type: Date, default: Date.now },
    status: String,
    deleted: { type: Boolean, default: false }
}, {
    strict: true,
    safe: true
});

ResultSchema.set('toJSON', {
	virtuals: true
});

ResultSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Result', ResultSchema);