const schedule = require('node-schedule')
const { VehicleData, AvgData, SumData } = require("../models/vehicleDataModel");
const mongoose = require('mongoose')
const { aggregateData } = require('../controllers/aggregateDataController')
const { deleteAllData } = require('../controllers/vehicleDataController')


// Schedule the task to run on the first day of every month at midnight
const scheduleRule = new schedule.RecurrenceRule()
scheduleRule.dayOfMonth = 1
scheduleRule.hour = 0
scheduleRule.minute = 0

// Aggregate the existing timeseries data and clean the database
const scheduledTask = schedule.scheduleJob(scheduleRule, () => {
  aggregateData(); // aggregate the existing timeseries data into a summation and average
  // deleteAllData(); // delete the existing timeseries data
})


module.exports = scheduledTask
