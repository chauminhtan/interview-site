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
            answer: { type: String, default: '' },
            made: { type: String, default: '' },
            isCorrect: { type: Boolean, default: false },
        }],
        position: { 
            id: { type: String, require: true, default: '' },
            name: { type: String, require: true, default: '' }
        },
    },
    user: {
        id: String,
        name: String,
        email: String
    },
    point: { type: Number, default: 0 },
	time: { type: Number, default: 0 },
    dateModified: { type: Date, default: Date.now },
    status: String,
    done: { type: Boolean, default: false },
    isChecked: { type: Boolean, default: false },
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