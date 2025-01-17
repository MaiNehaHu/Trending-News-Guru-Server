const Location = require('../models/location');
const AWS = require('aws-sdk');
require("dotenv").config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
    apiVersion: "latest",
});

// Translate Function
async function translateText(text, targetLang) {
    const translate = new AWS.Translate();

    if (!text || !targetLang) {
        throw new Error("Text and target language are required");
    }

    const params = {
        Text: text,
        SourceLanguageCode: 'en',
        TargetLanguageCode: targetLang,
    };

    try {
        const response = await translate.translateText(params).promise();
        return response?.TranslatedText;
    } catch (error) {
        console.error("Error during translation:", error);
        throw new Error("Translation failed");
    }
}

// Get all locations
const getLocationsList = async (req, res) => {
    const { lang = "en" } = req.query;

    try {
        const locationsList = await Location.find();

        if (lang === "en") {
            return res.status(200).json(locationsList);
        }

        const translatedLocations = await Promise.all(
            locationsList.map(async (location) => {
                const translatedName = await translateText(location.name, lang);
                return {
                    ...location.toObject(),
                    name: translatedName,
                };
            })
        );

        res.status(200).json(translatedLocations);
    } catch (error) {
        console.error("Error translating Location:", error);
        res.status(500).json({ error: "Failed to translate Location" });
    }
};

// Add a new location
const addLocationList = async (req, res) => {
    const { name } = req.body;

    try {
        const newLocationsList = new Location({ name });
        await newLocationsList.save();
        res.status(201).json(newLocationsList);
    } catch (error) {
        res.status(500).json({ error: "Failed to add new Location" });
    }
};

// Update a location
const updateLocationList = async (req, res) => {
    const { id } = req.params;
    const { name, locationKey, imageURL } = req.body;

    try {
        const updatedCategory = await Location.findByIdAndUpdate(
            id,
            { name, imageURL, locationKey },
            { new: true }
        );

        if (!updatedCategory) return res.status(404).json({ error: "Location not found" });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: "Failed to update Location" });
    }
};

// Delete a location
const deleteLocationList = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLocation = await Location.findByIdAndDelete(id);
        if (!deletedLocation) return res.status(404).json({ error: "Location not found" });
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete popular location" });
    }
};

module.exports = {
    getLocationsList,
    addLocationList,
    updateLocationList,
    deleteLocationList,
};
