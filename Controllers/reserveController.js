//use model
const Reserve = require('../models/reserve');

// get reservation
exports.get= async (req, res) => {
    console.log(req.reserve);
    try {
      const reserve = await Reserve.find();
      res.json(reserve);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error!" })
    }
  }
// creat reservation
exports.post=async (req, res) => {
    try {
          const creatReserve = await Reserve.create({
            nom: req.body.nom,
            prenom: req.body.prenom,
            telephone: req.body.telephone,
          }); res.json(creatReserve);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error!" })
    }
  }
// upldate reservations
  exports.put=async (req, res) => {
    try {
        const reserve = await Reserve.findByIdAndUpdate(
          req.params.id,
          {
              nom: req.body.nom,
              prenom: req.body.prenom,
              telephone: req.body.telephone,
          },
          {
            new: true,
          }
        );
       res.json({message:"votre modification a été enregistrer"})
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  }

//   delete
exports.delete=async (req, res) => {
    try {
      const reserves = await Rreserve.findByIdAndRemove(req.params.id);
      res.json({ message: " reserve has been deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error!" })
    }
  
  
  }