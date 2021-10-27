const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//use model
const User = require('../models/users');


// change pass
router.put('/pass/:id', async (req, res) => {
    try {
        const userCompte = await User.findById(req.params.id);
        console.log(userCompte);
        const hashpassword = await bcrypt.hash(req.body.password1 , 10);
        if (userCompte==null) {console.log(req.body.password);
            res.status(404).json({
                message:
                    " there is no user with this ID to update .please check ID again .",
            });
        }
        else {
            const cmp = await bcrypt.compare(req.body.password, userCompte.password);
           console.log(cmp);
            if (cmp) {
                const user = await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        firstName: userCompte.firstName,
                        lastName: userCompte.lastName,
                        email: userCompte.email,
                        phone: userCompte.phone,
                        password: hashpassword,
                        role: userCompte.role
                    }
                );
                res.status(200).json(user);
            }
            else{
                res.status(404).json({
                    message:
                        " password wrong",
                });
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
    }
})

module.exports = router;