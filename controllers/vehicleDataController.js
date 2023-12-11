//const VehicleData = require('../models/vehicleDataModel')
const { VehicleData, AvgData, SumData } = require("../models/vehicleDataModel");
const mongoose = require("mongoose");
const fs = require("fs"); // Require the 'fs' module to work with files

// Upload data
const uploadVehicleData = async (req, res) => {
	const { vehicleName, vehicleID, mpg, CO, NOx, particulateMatter, fuelLevel, flowrate, time, hydrogenFuel } =
		req.body;

	// Add data to DB
	try {
		const vehicleData = await VehicleData.create({
			vehicleName,
			vehicleID,
			mpg,
			CO,
			NOx,
			particulateMatter,
			fuelLevel,
			flowrate,
			time,
			hydrogenFuel,
		});
		res.status(200).json(vehicleData);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Upload Multiple data
const uploadManyVehicleData = async (req, res) => {
	const dataToInsert = req.body;

	if (!Array.isArray(dataToInsert) || dataToInsert.length === 0) {
		return res.status(400).json({ error: "Invalid input data" });
	}

	try {
		const insertedData = [];

		for (const data of dataToInsert) {
			const { vehicleName, vehicleID, mpg, CO, NOx, particulateMatter, fuelLevel, flowrate, time, hydrogenFuel } =
				data;

			// Add data to DB
			const vehicleData = await VehicleData.create({
				vehicleName,
				vehicleID,
				mpg,
				CO,
				NOx,
				particulateMatter,
				fuelLevel,
				flowrate,
				time,
				hydrogenFuel,
			});

			insertedData.push(vehicleData);
		}

		res.status(200).json(insertedData);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Upload data via file
const uploadVehicleDataFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file upload" });
		}
		const fileData = req.file.buffer.toString(); // Assuming the uploaded file is in binary form

		// Parse the JSON data from the file
		const jsonData = JSON.parse(fileData);

		const { vehicleName, vehicleID, mpg, CO, NOx, particulateMatter, fuelLevel, flowrate, time, hydrogenFuel } =
			jsonData;

		// Add data to DB
		const vehicleData = await VehicleData.create({
			vehicleName,
			vehicleID,
			mpg,
			CO,
			NOx,
			particulateMatter,
			fuelLevel,
			flowrate,
			time,
			hydrogenFuel,
		});

		res.status(200).json(vehicleData);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Get a single specific data
const getDataPoint = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	const vehicleData = await VehicleData.findById(id);

	if (!vehicleData) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Delete data
const deleteDataPoint = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	const vehicleData = await VehicleData.findOneAndDelete({ _id: id });

	if (!vehicleData) {
		return res.status(400).json({ error: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Update a single data
const updateDataPoint = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	const vehicleData = await VehicleData.findOneAndUpdate(
		{ _id: id },
		{
			...req.body,
		}
	);

	if (!vehicleData) {
		return res.status(400).json({ error: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Get all the distinct vehicles
const getVehicles = async (req, res) => {
	try {
		const vehicleIDs = await VehicleData.distinct("vehicleID");
		const vehicleDataPromises = vehicleIDs.map(async (vehicleID) => {
			// Get the corresponding vehicleName for each vehicleID
			const vehicleData = await VehicleData.findOne({ vehicleID: vehicleID });
			if (vehicleData) {
				return { vehicleID: vehicleID, vehicleName: vehicleData.vehicleName };
			}
		});

		const vehicleDataResults = await Promise.all(vehicleDataPromises);
		const vehicleData = vehicleDataResults.filter((data) => data !== undefined);

		res.status(200).json(vehicleData);
	} catch (error) {
		res.status(500).json({ error: "Failed to get vehicleIDs" });
	}
};

// The following functions accept optional vehicleID and hydrogenFuel parameters with which to filter

// Get all data
const getAllData = async (req, res) => {
	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;
	const filter = {
		$and: [vehicleID ? { vehicleID } : {}, hydrogenFuel ? { hydrogenFuel } : {}],
	};

	const vehicleData = await VehicleData.find(filter).sort({ createdAt: -1 });

	res.status(200).json(vehicleData);
};

// Delete all data
const deleteAllData = async (req, res) => {
	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;
	const filter = {
		$and: [vehicleID ? { vehicleID } : {}, hydrogenFuel ? { hydrogenFuel } : {}],
	};
	try {
		const vehicleData = await VehicleData.deleteMany(filter);
		res.status(200).json({ message: `${vehicleData.deletedCount} data points deleted` });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete data" });
	}
};

// Get latest single data point
const getLatestDataPoint = async (req, res) => {
	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;
	const filter = {
		$and: [vehicleID ? { vehicleID } : {}, hydrogenFuel ? { hydrogenFuel } : {}],
	};

	const vehicleData = await VehicleData.findOne(filter).sort({ time: -1 });

	if (!vehicleData) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Get N latest data points
const getNLatestData = async (req, res) => {
	const N = req.params.N;
	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;
	const filter = {
		$and: [vehicleID ? { vehicleID } : {}, hydrogenFuel ? { hydrogenFuel } : {}],
	};

	const vehicleData = await VehicleData.find(filter).sort({ createdAt: -1 }).limit(parseInt(N));

	if (!vehicleData || vehicleData.length == 0) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Get sorted data by date/time
const getTimedData = async (req, res) => {
	const time = req.params.time;
	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;
	const filter = {
		$and: [
			{ createdAt: new Date(time) },
			{ vehicleID: vehicleID ? { vehicleID } : {} },
			{ hydrogenFuel: hydrogenFuel ? { hydrogenFuel } : {} },
		],
	};

	const vehicleData = await VehicleData.findOne(filter);

	if (!vehicleData) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Get sorted data by a date/time range
const getTimedDataRange = async (req, res) => {
	const { startTime, endTime } = req.params;
	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;
	const filter = {
		$and: [
			{
				createdAt: {
					$gte: new Date(startTime), // Greater than or equal to startTime
					$lte: new Date(endTime), // Less than or equal to endTime
				},
			},
			{ vehicleID: vehicleID ? { vehicleID } : {} },
			{ hydrogenFuel: hydrogenFuel ? { hydrogenFuel } : {} },
		],
	};

	const vehicleData = await VehicleData.find(filter);

	if (!vehicleData || vehicleData.length === 0) {
		return res.status(404).json({ error: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Get sorted data by a start date/time
const getTimedDataStart = async (req, res) => {
	const startTime = req.params.startTime;
	// Check if startTime is a valid date/time
	if (isNaN(Date.parse(startTime))) {
		return res.status(400).json({ error: "Invalid date/time" });
	}
	const startTimeDate = new Date(startTime);

	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;

	let filter = {
		createdAt: {
			$gt: startTimeDate, // Greater than startTime
		},
	};

	if (vehicleID) {
		filter.vehicleID = vehicleID;
	}

	if (hydrogenFuel) {
		filter.hydrogenFuel = hydrogenFuel;
	}

	const vehicleData = await VehicleData.find(filter);

	if (!vehicleData || vehicleData.length === 0) {
		return res.status(204).json({ message: "Specified data not found" });
	}

	res.status(200).json(vehicleData);
};

// Get latest Fuel Level data point
const getLatestFuelLevelData = async (req, res) => {
	const vehicleID = req.query.vehicleID;
	const hydrogenFuel = req.query.hydrogenFuel;
	const filter = {
		$and: [vehicleID ? { vehicleID } : {}, hydrogenFuel ? { hydrogenFuel } : {}],
	};

	const fuelLevelData = await VehicleData.findOne(filter).sort({ time: -1 }).select("fuelLevel time");

	if (!fuelLevelData) {
		return res.status(204).json({ error: "Specified data not found" });
	}

	res.status(200).json(fuelLevelData);
};

module.exports = {
	uploadVehicleData,
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
	uploadManyVehicleData,
	getLatestFuelLevelData,
	getVehicles,
};
