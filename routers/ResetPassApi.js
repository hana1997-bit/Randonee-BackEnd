const Token = require("../models/pass");
const User = require("../models/users");
const express=require('express');
const Transporter = require("../utils/Transporter");
const bcrypt=require('bcrypt')
const router = express.Router();
const crypto=require('crypto')

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
router.get("/:userId/:token", async (req, res) => {
  try{
    const user = await User.findOne({email : req.body.email});
    const {userId,token}=req.params;
  //  if is not exist
  if(user._id!=userId){
    res.json({message:"this id isn/'t exist"});

  }
  else{
    const sercret = process.env.ACCESS_TOKEN_SECRET+user.password;
    const payload = jwt.verify(token, sercret);

  }
    
    res.json(user._id)

  }catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
});
router.post("/:userId/:token", async (req, res) => {
    try {
        const user = await User.findOne({email : req.body.email});
        const {userId,token}=req.params;
      //  if is not exist
      if(user._id!=userId){
        res.json({message:"this id isn/'t exist"});
    
      }

        const new_token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).json("Invalid link or expired");
        const hashpassword = await bcrypt.hash(req.body.password, 10);
   
        user.password = hashpassword;
        res.json( user);
    } catch (error) {
        res.json("An error occured");
        console.log(error);
    }
});

module.exports = router;