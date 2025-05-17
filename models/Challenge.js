const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    userId: { type: String, required: true }
});

const challengeSchema = new mongoose.Schema({
    challenger: { type: playerSchema, required: true },
    challengee: { type: playerSchema, required: true },
    status: { type: String, required: true, default: "pending" },
    timestamp: { type: Date, default: Date.now }
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
