const connectDB = require("./db/connect");
const Employee = require("./models/employee");

const employeesJson = require("./employees.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Employee.insertMany(employeesJson, { ordered: false });
    console.log("Yayy!! sucessfully inserted employees");
  } catch (err) {
    console.log(err);
  }
};

start();
