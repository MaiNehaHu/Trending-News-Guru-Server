const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  addEmployee,
  editEmployee,
  deleteEmployee,
} = require("../controllers/employees");

// Route to get all employee details
router.route("/").get(getAllEmployees).post(addEmployee);

// Route to edit an employee by ID
router.route("/:id").put(editEmployee);

// Route to delete an employee by ID
router.route("/:id").delete(deleteEmployee);

module.exports = router;
