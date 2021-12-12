const express = require('express');
const router = express.Router();
//use model
const Reserve = require('../models/reserve');


// get all reserve
router.get('/reserves', async (req, res) => {
  console.log(req.reserve);
  try {
    const reserve = await Reserve.find();
    res.json(reserve);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error!" })
  }
});

//get reserve by id
router.get('/reserves/:id', async (req, res) => {
  try {
    const reserve = await Reserve.findById(req.params.id);
    res.json(reserve);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "no one have this id" })
  }
});

// creat all reserve
router.post('/creat', async (req, res) => {
  try {
    const creatReserve = await Reserve.create({
      event: req.body.event,
      nom: req.body.nom,
      prenom: req.body.prenom,
      telephone: req.body.telephone,
    }); res.json(creatReserve);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error!" })
  }
});
//update reserve
router.put('/reserves/:id', async (req, res) => {
  try {
    const reserve = await Reserve.findByIdAndUpdate(
      req.params.id,
      {
        event: req.body.event,
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
      },
      {
        new: true,
      }
    );
    res.json({ message: "votre modification a été enregistrer" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});



//delete reserve
router.delete('/reserves/:id', async (req, res) => {
  try {
    const reserves = await Reserve.findByIdAndRemove(req.params.id);
    res.json({ message: " reserve has been deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error!" })
  }


});





module.exports = router;