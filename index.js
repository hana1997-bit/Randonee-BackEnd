const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

// configuration de dotenv
dotenv.config();
//  bodyparser config 
const bodyParser = require('body-parser');
const app = express();

// bearerStrategy with passport
require('./passport/bearerStrategy');

const port = 3000;
//connect to database
const connect = require('./Data_Base/connect');

//configuration morgan
app.use(morgan('dev'));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user Api
const user = require('./routers/userApi');
app.use('',user);
// agent Api
const agent = require('./routers/agenceApi');
app.use('',agent);
//reset Api
const reset = require('./routers/ResetPassApi');
app.use('',reset);
app.listen(port, () => {
    console.log(`application listening at http://localhost: ${port}`);
})