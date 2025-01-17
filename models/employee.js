const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeID: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
