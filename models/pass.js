
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
   token: {
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
  },
  created: {
      type: Date,
      default: () => Date.now(),
  },
  // will automatically delete after 10 min
  // can be a bit delay, because the bg thread runs every 60 sec
  expire_at: { type: Date, default: Date.now, expires: 600 }
});
module.exports = mongoose.model("Token", tokenSchema);




// creation de model
const Pass = mongoose.model('pass', tokenSchema);

module.exports = Pass;

