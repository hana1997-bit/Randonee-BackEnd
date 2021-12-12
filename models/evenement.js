const mongoose = require('mongoose');
const { Schema } = mongoose;
const agentSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
   nombre:{
      type:Number,
      require:true,
   },
   imgs: {
      type: Array,
   },
   evenement: {
      type: String,
      required: true,
   },
   localisation: {
      type: String,
      required: true,
   },
   temps: {
      type: Number,
      required: true,
   },
   prix: {
      type: Number,
      required: true,
   },
  phone: {
      type: Number,
      required: true,
      unique: true,
   },
}, {
   versionKey: false, // paramétre pour mongodb , désactivier _v on mongoDB
   timestamps: false // temps de create et temps de modifier (creatAT,updateAT)

});


// creation de model
const Agent = mongoose.model('agent', agentSchema);



module.exports = Agent;
