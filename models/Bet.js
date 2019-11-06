const mongoose = require('mongoose');
const { Schema } = mongoose;

const BetSchema = new Schema({
    creatorAddress: String,
    betAddress: String,
    value: Number,
    isFinished: Boolean,
}, { collection: 'bets-collection', versionKey: false });

mongoose.model('Bet', BetSchema);
