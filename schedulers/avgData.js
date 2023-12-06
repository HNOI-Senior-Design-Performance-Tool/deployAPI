const schedule = require('node-schedule')
const { VehicleData, AvgData } = require('../models/vehicleDataModel');
const mongoose = require('mongoose')

const scheduleRule = new schedule.RecurrenceRule()
scheduleRule.dayOfMonth = 1
scheduleRule.hour = 0
scheduleRule.minute = 0

const scheduledTask = schedule.scheduleJob(scheduleRule, () => {
    averageMonthlyData()
})

const averageMonthlyData = async (req, res) => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59)

    const vehicleData = await VehicleData.find({
        time: {
            $gte: startOfMonth,
            $lte: endOfMonth   
        }
    })

    if (!vehicleData || vehicleData.length === 0) {
        return res.status(404).json({ error: 'No data within the range' })
    }

    // Initialize objects to store the sum of each field and count of data points
    const sum = {
        mpg: 0,
        CO: 0,
        NOx: 0,
        particulateMatter: 0,
        fuelLevel: 0,
        flowrate: 0,
    }
    let count = 0

    // Calculate the sum of each field and count of data points
    vehicleData.forEach(dataPoint => {
        // Check if the field is valid
        if (dataPoint.mpg !== undefined) sum.mpg += dataPoint.mpg;
        if (dataPoint.CO !== undefined) sum.CO += dataPoint.CO;
        if (dataPoint.NOx !== undefined) sum.NOx += dataPoint.NOx;
        if (dataPoint.particulateMatter !== undefined) sum.particulateMatter += dataPoint.particulateMatter;
        if (dataPoint.fuelLevel !== undefined) sum.fuelLevel += dataPoint.fuelLevel;
        if (dataPoint.flowrate !== undefined) sum.flowrate += dataPoint.flowrate;
        count++;
    })

    // Calculate the average of each field
    const average = {}
    for (const key of Object.keys(sum)) {
        average[key] = sum[key] / count
    }

    // Create a new document in the database to store the average values
    const averageData = await AvgData.create({
        startRange: startOfMonth,
        endRange: endOfMonth,
        mpg: average.mpg,
        CO: average.CO,
        NOx: average.NOx,
        particulateMatter: average.particulateMatter,
        fuelLevel: average.fuelLevel,
        flowrate: average.flowrate,
        time: new Date(),
    })

    res.status(200).json({ averageData })
    console.log('Scheduled task executed for monthly average calculation')
}

// Uncomment this line below to execute the task immediately
// averageMonthlyData()

module.exports = scheduledTask
