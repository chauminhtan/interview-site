var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PositionSchema = new Schema({
    name: { type: String, require: true },
    languages: [{
        name: String,
        categories: [{
            title: String,
            quantity: Number
        }]
    }],
    dateModified: { type: Date, default: Date.now },
    status: String,
    deleted: {type: Boolean, default: false }
}, {
    strict: true,
    safe: true
});

PositionSchema.set('toJSON', {
	virtuals: true
});

PositionSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
};

module.exports = mongoose.model('Position', PositionSchema);