const Token = require("../models/pass");
const User = require("../models/users");
const express=require('express');
const Transporter = require("../utils/Transporter");
const crypto = require("crypto");
const bcrypt=require('bcrypt')
const router = express.Router();

router.post("/reset", async (req, res) => {
    const clientURL = "http://localhost:3000";
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.json({ message: "this email isn't exist" });
    }
    const token = await Token.findOne({ userId: user._id });
    // if (token) {
    //   await token.deleteOne()
    // };
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(resetToken);
    const hash = await bcrypt.hash(resetToken, 10);
    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    })
    console.log("token " + hash);

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    const mailoption = {
      from: process.env.MAIL, // jsoner address
      to: "idoudihana06@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      html: link, // html body
    }
    const info = await Transporter.sendMail(mailoption)
    res.json({ message: 'check your mail' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
});
router.post("/:userId/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).json({message : user + "invalid link or expired"});

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).json("Invalid link or expired");

        user.password = req.body.password;
        await user.save();
        await token.delete();

        res.json("password reset sucessfully.");
    } catch (error) {
        res.json("An error occured");
        console.log(error);
    }
});

module.exports = router;