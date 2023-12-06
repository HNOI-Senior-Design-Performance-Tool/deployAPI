const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
const mongodb = require("mongodb");

// const vehicleDataSchema = mongoose.model('VehicleData');
const vehicleDataRoutes = require('./routes/vehicleData')
const aggregateDataRoutes = require('./routes/aggregateData')

// Start DB -> mongod --config /usr/local/etc/mongod.conf --fork
//       OR -> brew services start mongodb-community@6.0
// Interact with DB manually -> mongosh
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );


app.use(
    // allow CORS from hnoi.netlify.app and localhost:3000
    cors({
        origin: ["http://hnoi.netlify.app", "http://localhost:3000"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/*
// Middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
*/
// Middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api/vehicleData', vehicleDataRoutes)
app.use("/api/aggregateData", aggregateDataRoutes);

//Connect to DB instance
mongoose.connect('mongodb+srv://admin:admin@seniordesigndb.2hphwnj.mongodb.net/?retryWrites=true&w=majority');
mongoose.connection.on('error', console.error.bind(console, 'HNO Database Connection Error:'));
mongoose.connection.once('connected', () => {console.log('HNO Database Connected')});

app.post('/newData',  function (req, res) {
    //PATH TO HANDLE NEW DATA
    //todo make function robust for both obd and hardware team data pushes

    //get data from request
    const data = {
        timestamp: req.body.obd.timestamp,
        vehicleId: req.body.misc.vehicleId,
        obd: req.body.obd,
        misc: {
            hydrogenLevel: req.body.misc.hydrogenLevel,
            currentMPG: 2.352 * req.body.obd.EngineInstantaneousFuelEconomy,
            fuelSavings: 1 / (req.body.misc.defaultMPG - this.currentMPG),
            CO2Reductions: 10180 * this.fuelSavings,
        }
    }

    //create schema instance
    const newData = new dataSchema({
        timestamp: data.timestamp,
        vehicleId: data.vehicleId,
        obd: data.obd,
        misc: data.misc,
    });

    //save to DB
    dataSchema.insertMany(newData).then((err) => {
        if (err) {
            console.log(err);
            res.status(400).json({
                message: 'Error saving data to DB'
            });
        } else {
            console.log("Data saved to DB")
            res.status(200).json({
                message: 'Data saved to DB'
            });
        }
    });
});

app.get('/getData', function (req, res) {
    //PATH TO GET DATA

    dataSchema.find().then((data) => {
        if (data.length > 100) {
            //Return real data if there is more than 100 entries
            res.status(201).json({
                data: data,
            });
        }else{
            //Return sample data if there is less than 100 entries
            sampleSchema.find().then((data) => {
                if (data != null) {
                    res.status(202).json({
                        data: data,
                    });
                }else{
                    res.status(401).json({
                        message: 'No data found',
                    });
                }
            });
        }
    });
});

app.get('/clearData', function (req, res) {
    //delete all data from db if needed
    dataSchema.deleteMany({}).then((err) => {
        if (err) {
            console.log(err);

            res.status(401).json({
                message: 'No data cleared from DB',
            });

        } else {
            console.log("Data cleared from DB")

            res.status(200).json({
                message: 'Data cleared from DB',
            });
        }
    });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080/'))

//const scheduledTask = require('./schedulers/avgData')

module.exports = app;
