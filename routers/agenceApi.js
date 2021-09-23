const express = require('express');
const router = express.Router();
const multer= require('multer');
const Agent = require('../models/agences');

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
router.post('/creation', upload.single('files'), async (req, res) => {
    try {
        const agent = await Agent.find({ email: req.body.email });
        if (!agent) {
            res.json({ message: "mail existe" })
        }
        else {
            const creat_agent = await Agent.create(req.body);
            res.json(creat_agent);
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error!" })
    }
});
//update Agent
router.put('/agents/:id', upload.single('files'), async (req, res) => {
    try {
        const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(agent);
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





module.exports = router;