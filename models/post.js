var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    Topic: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100,
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
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    Comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
});
/*
postSchema.virtual('url').get(function(){
              return '/post/' + this._id
           })
*/

//Export model
module.exports = mongoose.model('Post', PostSchema);
