const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


//middleware
app.use(express.json());
app.use(cors());

// routes 
const userRoute = require('./routes/user.route');
const freedomFighterRoute = require('./routes/freedomFighters.route')


app.get('/', (req, res) => {
    res.send('Server is Running!!')
})


app.use('/api/v1/users', userRoute)
app.use('/api/v1/freedomFighters', freedomFighterRoute)




module.exports = app;