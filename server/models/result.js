var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
    test: { 
        id: String, 
        title: String, 
        time: Number,
        answer: String,
        questions: [{ 
            id: String, 
            description: String, 
            answer: String,
            isCorrect: Boolean 
        }],
    },
    pass: { type: Boolean, default: false },
	time: { type: Number },
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