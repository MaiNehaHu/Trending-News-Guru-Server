// env data imported
require("dotenv").config(); // Load environment variables from a .env file

// express js
const express = require("express");

// routes
const products_routes = require("./routes/posts");
const employees_routes = require("./routes/employees");
const image_routes = require("./routes/upload-image");
const translate = require("./routes/translate");
const categories_routes = require("./routes/categories");
const locations_list_routes = require("./routes/locations");
const supported_languages_routes = require("./routes/supported-languages");

//db connection
const connectDB = require("./db/connect");

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hey Nehu... Your Backend is running in browser 🎉");
});

// Set up routes
app.use("/api/posts", products_routes);
app.use("/api/employees", employees_routes);
app.use("/api/upload-image", image_routes);
app.use("/api/categories", categories_routes);
app.use("/api/locations_list", locations_list_routes);
app.use("/api/supported-languages", supported_languages_routes);

app.use("/api/translate", translate);

const start = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(PORT, () => {
      console.log(`Yay!! Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

// Start the application
start();
