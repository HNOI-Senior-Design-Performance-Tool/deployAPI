const mongoose = require('mongoose')

const Schema = mongoose.Schema

const vehicleDataSchema = new Schema({
    vehicleName: {
        type: String,
        require: false
    },
    vehicleID: {
        type: String, 
        require: true
    },
    mpg: {
        type: Number,
        require: false
    },
    CO: {
        type: Number,
        require: false
    },
    NOx: {
        type: Number,
        require: false
    },
      particulateMatter: {
        type: Number,
        require: false
    },
    fuelLevel: {
        type: Number,
        require: false
    },
    flowrate: {  // Flowrate of hydrogen Units: L/min
        type: Number,
        require: true
    },
    time: {
        type: Date,
        required: true
    }

}, { timestamps: true })

// Data schema for aggregated data
// Could be used for averaged data or summed data
const aggregateDataSchema = new Schema({

    vehicleName: {
        type: String,
        require: true
    },
    vehicleID: {
        type: String,
        require: true
    },

    mpg: Number,
    mpgCount: Number,

    CO: Number,
    COCount: Number,

    NOx: Number,
    NOxCount: Number,

    particulateMatter: Number,
    particulateMatterCount: Number,
    
    startTime: Date,
    endTime: Date,
}, { timestamps: true })

const VehicleData = mongoose.model('VehicleData', vehicleDataSchema)
const AvgData = mongoose.model("AvgData", aggregateDataSchema);
const SumData = mongoose.model("SumData", aggregateDataSchema);

module.exports = {
  VehicleData,
  AvgData,
  SumData,
};