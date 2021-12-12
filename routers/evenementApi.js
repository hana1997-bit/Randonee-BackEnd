const express = require('express');
const router = express.Router();
const multer = require('multer');
const Agent = require('../models/evenement');
const User = require('../models/users');
const path = require('path');
const fs = require('fs');

// get all agents
router.get('/agents', async (req, res) => {
    try {
        const agent = await Agent.find();
        res.json(agent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
});

//get agent by id
router.get('/agents/:id', async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        res.json(agent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "no one have this id" })
    }
});

// 1.0 create storage

const my_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },

    filename: (req, file, cb) => {
        const file_extention = path.extname(file.originalname);
        // const uniqueSuffix = Date.now() + file_extention
        // console.log(file_extention)
        cb(null, Date.now() + '_' + file.originalname)

    },

    limits: {
        fileSize: 1024 * 1024
    }
});

// file filter function 
const fileFilterFunction = (req, file, cb) => {
    const file_extention = path.extname(file.originalname);
    const allowedExtentions = [".jpg", ".jpeg", ".png", ".gif", ".PNG"]
    if (!allowedExtentions.includes(file_extention)) {
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
};
// 2.0 create upload
const upload = multer({ storage: my_storage, fileFilter: fileFilterFunction })

// creat events
router.post('/creation', upload.array('imgs'), async (req, res) => {
    try {
        // if (req.file) {
        // console.log(req.file.path);
        let imgs = []
        console.log(req.files)
        req.files.forEach(file => {
            imgs.push(file.filename)
        });
        const creatEvent = await Agent.create({
            ...req.body,
            imgs
        });
         res.json(creatEvent);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error!" })
    }
});
//update Agent
router.put('/agents/:id', upload.array('imgs', 4), async (req, res) => {
    try {
        
        const eventId = await Agent.findById(req.params.id,req.body);
        let imgs = eventId.imgs;
        // console.log(imgs);
        if (req.files) {   
        req.files.forEach(file => {
            imgs.push(file.filename)
        });
        }
        // console.log(eventId + "id");
        // if (eventId) {
            const event = await Agent.findByIdAndUpdate(
                req.params.id,
                {
                    nombre: req.body.nombre,
                    evenement: req.body.evenement,
                    localisation: req.body.localisation,
                    temps: req.body.temps,
                    phone: req.body.phone,
                    prix: req.body.prix,
                    imgs:imgs,
                    user:req.body.user,
                },
                {
                    new: true,
                }
            );
            // supprimer l'image
            // try {
            //     fs.unlinkSync(eventId.images);
            //     //file removed
            // } catch (err) {
            //     console.error(err);
            // }
            res.json({
                message: "event has been updated ."
            });
        // }
         
        // else {
        //     res.status(404).json({
        //         message:
        //             " there is no event with this ID to update .please try again .",
        //     });
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
    }
});



//delete agent
router.delete('/agents/:id', async (req, res) => {
    try {
        const agent = await Agent.findByIdAndRemove(req.params.id);
        res.json({ message: " agent has been deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }


});

// affect reserve to  agent
router.put("/agentreserve/:idagent/:idreserve", async (req, res) => {
    try {
        const agent = await Agent.findByIdAndUpdate(
            req.params.idagent,
            { $push: { reserve: req.params.idreserve } },
            {
                new: true,
            }
        );
        res.json(agent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
    }
});
// desaffecte reserve to agent
router.put("/desaagentreserve/:idreserve/:idagent", async (req, res) => {
    try {
        const agent = await Agent.findByIdAndUpdate(
            req.params.idagent,
            { $push: { reserve: req.params.idreserve } },
            {
                new: true,
            }
        );
        res.json(agent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!" });
    }
});




module.exports = router;