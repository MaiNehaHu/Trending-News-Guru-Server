const express = require("express");
require("dotenv").config(); // Load environment variables from .env file

const aws = require("aws-sdk");
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new aws.S3();

async function deleteImage(req, res) {
  try {
    const imageURL = req.query.imageURL; // Get the image URL from the query params

    // Validate Image URL/Key
    if (!imageURL) {
      return res.status(400).json({ error: "Image key is required." });
    }
    // Extract the key from the full URL if necessary
    const imageKey = imageURL.includes("amazonaws.com")
      ? imageURL.split("/").pop()
      : imageURL;

    const params = {
      Bucket: BUCKET_NAME,
      Key: imageKey, // the key of the image you want to delete
    };
    await s3.deleteObject(params).promise();
    console.log("Image deleted successfully.");
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
}

// upload 
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path"); // To handle file extensions

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: "latest",
  region: process.env.REGION,
});

const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set content type
    metadata: function (req, file, callBack) {
      callBack(null, { fieldName: file.fieldname });
    },
    key: function (req, file, callBack) {
      // Generate a unique key with the original file extension
      const fileExtension = path.extname(file.originalname);
      callBack(null, "image_" + Date.now().toString() + fileExtension);
    },
  }),
});

module.exports = { deleteImage, uploadImage };
