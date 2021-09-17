const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Transporter = require('../utils/transporter');

//use model
const User = require('../models/users');
const Pass = require('../models/users');

const passport = require('passport');
const { getMaxListeners } = require('process');

// get all user
router.get('/users', passport.authenticate('bearer', { session: false }), async (req, res) => {
    console.log(req.user);
    try {
        const user = await User.find();
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
});

//get user by id
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "no one have this id" })
    }
});
// 1.0 create storage

const my_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/avatars')
    },

    filename: (req, file, cb) => {
        const file_extention = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + file_extention
        console.log(file_extention)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    },

    limits: {
        fileSize: 1024 * 1024
    }
});

// file filter function 
const fileFilterFunction = (req, file, cb) => {
    const file_extention = path.extname(file.originalname);
    const allowedExtentions = [".jpg", ".jpeg", ".png", ".gif"]
    if (!allowedExtentions.includes(file_extention)) {
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
};
// 2.0 create upload
const upload = multer({ storage: my_storage, fileFilter: fileFilterFunction })

// creat all user
router.post('/singup', upload.single('file'), async (req, res) => {
    try {
        const user = await User.findOne();
        const hashpassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashpassword);
        console.log(user);
        const creatUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file,
            password: hashpassword
        });
        res.json(creatUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
});
// singin user
router.post('/singin', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const cmp = await bcrypt.compare(req.body.password, user.password);
            console.log(cmp);
            if (cmp) {
                // creat jwt token
                const tokenData = {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                };
                const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
                res.json({ message: "authetification successful", token: token });
            }
            else {
                res.json({ message: "wrong email or password" });
            }

        }
        else {
            res.json({ message: "wrong email or password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
});
// //forget password 
// router.post('/sendmailV2', async (req, res) => {
//     try {
//         const pass = Pass.findOne({ email: req.body.email });
//         console.log(pass)
//         if (!user) {
//             res.json({ message: "this email isn't exist" });
//         }
//         else {
//             //  creat mail option
//             const mailoption = {
//                 from: process.env.MAIL, // sender address
//                 to: req.body.email, // list of receivers
//                 subject: "Hello ✔", // Subject line
//                 // text: req.user.password, // text body
              
//             };
//             console.log(req.user.password);
//             //  send mail
//             const info = await Transporter.sendMail(mailoption)
//             res.json({ message: 'check your mail' });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'internal server error' });
//     }
// });

//update user
router.put('/users/:id', async (req, res) => {
    try {
        const users = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error to update user!" })
    }

});

//delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const users = await User.findByIdAndRemove(req.params.id);
        res.json({ message: " user has been deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }


});





module.exports = router;