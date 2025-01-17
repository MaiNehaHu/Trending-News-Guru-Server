const express = require("express");
const app = express();
const AWS = require("aws-sdk");

// Set up AWS Translate
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const translate = new AWS.Translate();

async function supportedLanguages(req, res) {
  try {
    const params = {};
    const response = await translate.listLanguages(params).promise();
    res.json(response);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { supportedLanguages };
