var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    Name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 20,
    },
    Content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 200,
    },
    Timestamp: {
        type: Date,
        required: true,
    },

    Post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

//Export model
module.exports = mongoose.model('Comment', CommentSchema);
