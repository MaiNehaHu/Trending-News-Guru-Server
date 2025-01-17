const Employee = require("../models/employee");

// Get all employees
async function getAllEmployees(req, res) {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}

// Create a new employee
async function addEmployee(req, res) {
  try {
    // Optional validation to ensure required fields are present
    if (!req.body.name || !req.body.employeeID) {
      return res
        .status(400)
        .json({ error: "Name and EmployeeID are required" });
    }

    // Create a new employee
    const newEmployee = await Employee.create(req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Failed to add employee" });
  }
}

// Edit an employee's details
async function editEmployee(req, res) {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the updated data adheres to the schema
    });

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee" });
  }
}

// Delete an employee
async function deleteEmployee(req, res) {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
}

module.exports = {
  getAllEmployees,
  addEmployee,
  editEmployee,
  deleteEmployee,
};
