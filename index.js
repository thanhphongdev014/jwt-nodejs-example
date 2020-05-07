const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const privateDataRoute = require('./routes/privateData');

dotenv.config();

//import routes
const authRoute = require('./routes/auth');

//connect to DB
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true,useUnifiedTopology: true },
    () => console.log('connected to DB')
);

// Middlewares
app.use(express.json());

//route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', privateDataRoute);

app.listen(3000, () => console.log('server running'));