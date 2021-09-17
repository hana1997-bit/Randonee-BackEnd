const mongoose = require('mongoose');
const { Schema } = mongoose;

const agentSchema = new Schema({
   images: {
      type: Array[String],
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   localisation: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
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
   timestamps: true // temps de create et temps de modifier (creatAT,updateAT)

});


// creation de model
const Agent = mongoose.model('agent', agentSchema);



module.exports = Agent;
