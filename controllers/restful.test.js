const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const VehicleData = require("../models/vehicleDataModel");
const {
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
  uploadVehicleData,
  uploadManyVehicleData,
  uploadVehicleDataFile,
} = require("./vehicleDataController");

// Set up test database connection
const testDbUrl = "mongodb://localhost:27017/test-db";
beforeAll(async () => {
  await mongoose.connect(testDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up test database after all tests are done
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Set up test server
app.use(express.json());
app.use("/api", router);

// Test cases for getAllData function
describe("getAllData", () => {
  // Test case 1
  test("should return an empty array if no data is found", async () => {
    const response = await request(app).get("/api/data");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test case 2
  test("should return an array of vehicle data if data is found", async () => {
    const vehicleData = new VehicleData({
      /* vehicle data properties */
    });
    await vehicleData.save();

    const response = await request(app).get("/api/data");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([vehicleData.toJSON()]);
  });
});
