const express = require('express');
const Game = require('../models/Game');
const Challenge = require('../models/Challenge');
const game = express.Router();

game.post("/games", async (req, res) => {
    const username = req.body.username
    try {
        const game = await Game.findOne({
            $or: [
                { "players.white.username": username },
                { "players.black.username": username },
            ],
            status: "pending",
        }).exec();

        if (game) {
            const color = game.players.white.username === username ? 1 : 0;
            const opponent = color ? game.players.black.username : game.players.white.username;
            const args = {
                found: true,
                fen: game.fen,
                color, opponent,
                gameId: game._id
            };
            return res.json(args);
        }
        return res.json({ found: false });
    } catch (e) {
        return res.json({ found: false });
    }
})

game.post("/completedGames", async (req, res) => {
    const username = req.body.username
    try {
        const games = await Game.find({
            $or: [
                { "players.white.username": username },
                { "players.black.username": username },
            ],
            status: { $ne: "pending" },
        }).sort({ timestamp: -1 }).exec();

        const gamesWithTimestamp = games.map(game => ({
            ...game.toObject(),
            timestamp: game._id.getTimestamp(),
        }));

        return res.json(gamesWithTimestamp);
    } catch (e) {
        return res.json({ failed: true });
    }
})

game.post("/challenge", async (req, res) => {
    try {
        const { challenger, challengee, status } = req.body;

        if (!challenger || !challengee || !status) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newChallenge = new Challenge({
            challenger,
            challengee,
            status,
        });

        await newChallenge.save();

        res.status(201).json({success: true, challenge: newChallenge});
    } catch (error) {
        console.error("Error creating challenge:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

game.patch("/challenge/:id/accept", async (req, res) => {
    try {
        const challengeId = req.params.id;

        const updated = await Challenge.findByIdAndUpdate(
            challengeId,
            { status: "accepted" },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        res.status(200).json({ success: true, challenge: updated });
    } catch (error) {
        console.error("Error updating challenge:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

game.get("/challenge/pending", async (req, res) => {
    try {
        const pendingChallenges = await Challenge.find({ status: "pending" });

        res.status(200).json(pendingChallenges);
    } catch (error) {
        console.error("Error fetching pending challenges:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = game;