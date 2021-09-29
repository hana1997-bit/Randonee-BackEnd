const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Token = require('../models/pass');
const crypto = require("crypto");
const fs = require('fs');
const Transporter = require('../utils/transporter');
//use model
const User = require('../models/users');

const passport = require('passport');

// passport.authenticate('bearer', { session: false }),
exports.get =  async (req, res) => {
    console.log(req.user);
    try {
        const user = await User.find();
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
}

// 1.0 create storage

const my_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
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
// register
exports.create = upload.single('file'), async (req, res) => {
    console.log("hhh");
    try {
        const user = await User.find({ email: req.body.email });
        console.log(user);
        const hashpassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashpassword);
        if (!user) {
            res.json({ message: "mail existe" })
        }
        // const token = JWT.sign({ id: user._id }, JWTSecret);
        else {
            if (req.file) {
                const creatUser = await User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: req.body.age,
                    email: req.body.email,
                    phone: req.body.phone,
                    image: req.file.path,
                    password: hashpassword,
                    role: req.body.role
                }); res.json(creatUser);
        console.log(creatUser);

            }
            else {
                const creatUser = await User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: req.body.age,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashpassword,
                    role: req.body.role
                }); res.json(creatUser);
        console.log(creatUser);

            }

        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
}
// login
exports.login = async (req, res) => {
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
            res.json({ message: "user not exist" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    };

}
// upload user
exports.update = upload.single('file'), async (req, res) => {
    try {
        const hashpassword = await bcrypt.hash(req.body.password, 10);
        const userCompte = await User.findById(req.params.id);
        if (userCompte && req.file) {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: req.body.age,
                    email: req.body.email,
                    phone: req.body.phone,
                    image: req.file.path,
                    password: hashpassword,
                    role: req.body.role
                },
                {
                    new: true,
                }
            );
            // supprimer l'image
            try {
                fs.unlinkSync(userCompte.image);
                //file removed
            } catch (err) {
                console.error(err);
            }
            res.json({
                message: "user has been updated .",
                newUserInfos: user,
            });
        } else if (UserCompte && req.file == undefined) {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: req.body.age,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashpassword,
                    role: req.body.role
                },
                {
                    new: true,
                }
            );
            res.status(200).json({
                user: user,
            });
        } else {
            res.status(404).json({
                message:
                    " there is no user with this ID to update .please check ID again .",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
    }
}
// affecte agent to user
exports.put = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.iduser,
            { $push: { agents: req.params.idagent } },
            {
                new: true,
            }
        );
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
    }
}
// desaffecte agent to user
exports.put = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.iduser,
            { $pull: { agents: req.params.idagent } },
            {
                new: true,
            }
        );
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
    }
}
// delete
exports.delete = async (req, res) => {
    try {
        const users = await User.findByIdAndRemove(req.params.id);
        res.json({ message: " user has been deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }


}

