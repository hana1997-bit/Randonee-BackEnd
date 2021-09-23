const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,//85 char3 falestin tounes bilvidaires
        required: true,
    },
    versionKey: false, // paramétre pour mongodb , désactivier _v on mongoDB
    timestamps: false // temps de create et temps de modifier (creatAT,updateAT)

});



const Token = mongoose.model("token", tokenSchema);
module.exports = Token;