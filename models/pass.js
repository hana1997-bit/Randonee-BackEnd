const mongoose = require('mongoose');
const { Schema } = mongoose;

const passwordSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
   }
}, {
   versionKey: false, // paramétre pour mongodb , désactivier _v on mongoDB
   timestamps: true // temps de create et temps de modifier (creatAT,updateAT)

});




// creation de model
const Pass = mongoose.model('pass', passwordSchema);

module.exports = Pass;

