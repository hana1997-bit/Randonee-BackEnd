const mongoose= require('mongoose');

const options={
    useNewUrlParser : true,
    useUnifiedTopology: true
}
mongoose.connect("mongodb://localhost:27017/Randonée",options).then((connet)=>{
    console.log("=> connect to database successfully !");
}).catch(error => {
    console.log("=> connect to database with errors!");

    console.log(error);
});