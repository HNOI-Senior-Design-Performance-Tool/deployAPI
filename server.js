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
	// allow CORS from hnoi.netlify.app
	cors({
		origin: ["http://hnoi.netlify.app", "http://hnoi.netlify.app/"],
		credentials: true,
	})
);

// Add headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin to access the server
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow these HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Allow these headers
  res.setHeader('Access-Control-Allow-Credentials', true); // Allow cookies
  next();
});

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

app.listen(8080, () => console.log('API is running'))

//const scheduledTask = require('./schedulers/avgData')

module.exports = app;
