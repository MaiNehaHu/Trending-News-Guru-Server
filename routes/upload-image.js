
const express = require("express");
require("dotenv").config(); // Load environment variables from .env file

// suppress
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const { deleteImage, uploadImage } = require("../controllers/upload-image");

const router = express.Router();

router
  .route("/")
  .post(uploadImage.single("file"), async function (req, res, next) {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.status(200).json(req.file.location); // Return the file URL
  });

router.route("/").delete(deleteImage);

module.exports = router;
