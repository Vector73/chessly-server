const express = require("express");
const login = express.Router();
var User = require("../models/User");
const validator = require("email-validator");
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

login.post("/", async (req, res) => {
  try {
    const userData = req.body.user;
    const {
      userId,
      email,
      name,
      picture,
      verifiedEmail,
      createdTime,
      loginIds,
      OAuth
    } = userData;
    let user = await User.findOne({ userId });
    if (user === null) {
      user = new User({
        userId,
        email,
        name,
        picture,
        username: (loginIds && loginIds.length > 1) ? loginIds[2] : name,
        oauthProvider: OAuth?.google ? "google" : "unknown",
        verifiedEmail,
        createdTime: new Date(createdTime * 1000)
      });

      await user.save();
    } else {
      user.name = name;
      user.picture = picture;
      user.oauthProvider = OAuth?.google ? "google" : user.oauthProvider;
      user.verifiedEmail = verifiedEmail;
      user.createdTime = new Date(createdTime * 1000);
      user.username = (loginIds && loginIds.length > 1) ? loginIds[2] : name,

      await user.save();
    }
  } catch (e) {
    console.log(e)
    res.json({ error: e });
  }
});

module.exports = login;
