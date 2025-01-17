const express = require("express");
const router = express.Router();
const { getTranslatedText } = require("../controllers/translate");

// Route to get all employee details
router.route("/").get(getTranslatedText).post(getTranslatedText);

module.exports = router;
