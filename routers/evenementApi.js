const express = require('express');
const router = express.Router();
const multer = require('multer');
const Agent = require('../models/evenement');
const path = require('path');

// get all agents
router.get('/agents', async (req, res) => {
    try {
        const agent = await Agent.find().populate('agents');;
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

// creat events
router.post('/creation', upload.array('files'), async (req, res) => {
    try {
        if (req.file) {
            const creatEvent = await Agent.create({
                evenement: req.body.evenement,
                localisation: req.body.localisation,
                durée: req.body.durée,
                phone: req.body.phone,
                images: req.file.path
            }); res.json(creatEvent);

        }
        else {
            const creatEvent = await Agent.create({
                evenement: req.body.evenement,
                localisation: req.body.localisation,
                durée: req.body.durée,
                phone: req.body.phone
            }); res.json(creatEvent);

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
});
//update Agent
router.put('/agents/:id', upload.array('files'), async (req, res) => {
    try {
        const eventId = await Agent.findById(req.params.id);
        if (eventId & req.file) {
            const event = await Agent.findByIdAndUpdate(
                req.params.id,
                {
                    evenement: req.body.evenement,
                    localisation: req.body.localisation,
                    durée: req.body.durée,
                    phone: req.body.phone,
                    images: req.file.path
                },
                {
                    new: true,
                }
            );
            // supprimer l'image
            try {
                fs.unlinkSync(eventId.images);
                //file removed
            } catch (err) {
                console.error(err);
            }
            res.json({
                message: "event has been updated ."
            });
        } else if (eventId && req.file == undefined) {
            const event = await Agent.findByIdAndUpdate(
                req.params.id,
                {
                    evenement: req.body.evenement,
                    localisation: req.body.localisation,
                    durée: req.body.durée,
                    phone: req.body.phone
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
                    " there is no event with this ID to update .please try again .",
            });
        }
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