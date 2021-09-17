const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
   // image: {
   //    type: String,
   //    required: true,
   // },
   firstName: {
      type: String,
      required: true,
   },
   lastName: {
      type: String,
      required: true,
   },
   phone: {
      type: Number,
      required: true,
      unique: true,
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
   age: {
      type: Number,
      required: true,
   },
}, {
   versionKey: false, // paramétre pour mongodb , désactivier _v on mongoDB
   timestamps: true // temps de create et temps de modifier (creatAT,updateAT)

});


// creation de model
const User = mongoose.model('user', userSchema);




module.exports = User;

