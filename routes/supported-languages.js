const express = require("express");
const router = express.Router();
const { supportedLanguages } = require("../controllers/supported-languages");

// Route to get all employee details
router.route("/").get(supportedLanguages);

module.exports = router;
