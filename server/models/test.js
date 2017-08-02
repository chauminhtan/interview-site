var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TestSchema = new Schema({
    title: { type: String, require: true },
    position: { 
        id: { type: String, require: true, default: '' },
        name: { type: String, require: true, default: '' }
    },
    questions: [{ 
        id: String, 
        title: String
    }],
	time: { type: Number },
    dateModified: { type: Date, default: Date.now },
    status: String,
    deleted: { type: Boolean, default: false }
}, {
    strict: true,
    safe: true
});

TestSchema.set('toJSON', {
	virtuals: true
});

TestSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Test', TestSchema);