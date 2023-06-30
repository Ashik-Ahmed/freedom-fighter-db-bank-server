const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

// routes 
const userRoute = require('./routes/user.route');
const freedomFighterRoute = require('./routes/freedomFighters.route')
const successorRoute = require('./routes/successor.route')
const selectionRoute = require('./routes/selection.route')
const eventRoute = require('./routes/event.route')
const memberCategoryRoute = require('./routes/memberCategory.route')
const reportRoute = require('./routes/reports.route')


app.get('/', (req, res) => {
    res.send('Server is Running!!')
})


app.use('/api/v1/users', userRoute)
app.use('/api/v1/freedomFighters', freedomFighterRoute)
app.use('/api/v1/successor', successorRoute)
app.use('/api/v1/selection', selectionRoute)
app.use('/api/v1/event', eventRoute)
app.use('/api/v1/memberCategory', memberCategoryRoute)
app.use('/api/v1/reports', reportRoute)




module.exports = app;