const mongoose = require('mongoose');
const { Schema } = mongoose;
const reserveSchema = new Schema({
   event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
   },
   nom:{
    type: String,
    required: true,
   },
   prenom:{
    type: String,
    required: true,
   },
   telephone: {
      type: Number,
      required: true,
      unique: true,
   },
}, {
   versionKey: false, // paramétre pour mongodb , désactivier _v on mongoDB
   timestamps: false // temps de create et temps de modifier (creatAT,updateAT)

});


// creation de model
const Reserve = mongoose.model('reserve', reserveSchema);



module.exports =Reserve;
