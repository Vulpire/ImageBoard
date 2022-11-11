const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    author: {type: String, required: [true, 'author is required']},
    card: {type: String, required: [true, 'card is required']},
    set: {type: String, required: [true, 'set is required']},
    status: {type: String, required: [true, 'status is required']},
    wCard: {type: String, required: [true, 'wanted card is required']},
    wSet: {type: String, required: [true, 'wanted set is required']},
},
{timestamps: true});

module.exports = mongoose.model('Trade', tradeSchema);