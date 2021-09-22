const mongoose = require('mongoose');
const { Schema } = mongoose;
const agentSchema = new Schema({
   user: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true, 
      },
   images: {
      type: Array[String],
      required: true,
   },
   evenement: {
      type: String,
      required: true,
   },
   localisation: {
      type: String,
      required: true,
   },
   durée: {
      type: Number,
      required: true,
   },
   telephone: {
      type: Number,
      required: true,
      unique: true,
   },
}, {
   versionKey: false, // paramétre pour mongodb , désactivier _v on mongoDB
   timestamps: true // temps de create et temps de modifier (creatAT,updateAT)

});


// creation de model
const Agent = mongoose.model('agent', agentSchema);



module.exports = Agent;
