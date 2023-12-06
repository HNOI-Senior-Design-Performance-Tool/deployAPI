const express = require('express')
const {
	getAvgData,
	getSumData,
	aggregateData,
	deleteAllAggregateData,
} = require("../controllers/aggregateDataController");
const VehicleData = require('../models/vehicleDataModel')

const router = express.Router()

// Get average data
router.get('/avgData', getAvgData)

// Get sum data
router.get('/sumData', getSumData)

// Delete aggregate data
router.delete("/deleteAll", deleteAllAggregateData);

// Aggregate data
router.post('/update', aggregateData)

module.exports = router