const express = require('express')
const multer = require('multer');
const {
	uploadVehicleData,
	uploadManyVehicleData,
	getAllData,
	getDataPoint,
	getTimedData,
	getLatestDataPoint,
	getNLatestData,
	deleteDataPoint,
	updateDataPoint,
	deleteAllData,
	getTimedDataRange,
	getTimedDataStart,
	getLatestFuelLevelData,
	getVehicles,
} = require("../controllers/vehicleDataController");
const VehicleData = require('../models/vehicleDataModel')

const router = express.Router()
const upload = multer(); // Initialize multer

// Upload data
router.post('/uploadData', uploadVehicleData)

// Upload many data
router.post('/uploadManyData', uploadManyVehicleData)

// Upload data via file upload
router.post('/uploadData', upload.single('jsonFile'), uploadVehicleData);

// Get all data
router.get('/data', getAllData)

// Get sorted data by time
router.get('/getTimedData/:time', getTimedData)

// Get data by time range
router.get('/getTimedData/:startTime/:endTime', getTimedDataRange)

// Get data by start time
router.get('/latestDataGT/:startTime', getTimedDataStart)

// Get latest data point
router.get('/latestData', getLatestDataPoint)

// Get N latest data points
router.get('/latestData/:N', getNLatestData)

// Get Latest Fuel Level Data point
router.get('/latestFuelLevel', getLatestFuelLevelData)

// Get a single specific data
router.get('/data/:id', getDataPoint)

// Delete data
router.delete('/data/:id', deleteDataPoint)

// Update a single data
router.patch('/data/:id', updateDataPoint)

// Delete all data
router.delete('/data' , deleteAllData)

// Get all vehicles
router.get("/vehicles", getVehicles);

module.exports = router