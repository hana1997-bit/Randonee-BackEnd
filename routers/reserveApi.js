const express = require('express');
const router = express.Router();
const reserveController = require('../Controllers/reserveController')
//use model
const Reserve = require('../models/reserve');


// get all reserve
router.get('/reserves',reserveController.get);

//get reserve by id
// router.get('/reserves/:id', async (req, res) => {
//   try {
//     const reserve = await Reserve.findById(req.params.id);
//     res.json(reserve);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "no one have this id" })
//   }
// });

// creat all reserve
router.post('/creat',reserveController.post);
//update reserve
router.put('/reserves/:id',reserveController.put);



//delete reserve
router.delete('/reserves/:id',reserveController.delete);





module.exports = router;