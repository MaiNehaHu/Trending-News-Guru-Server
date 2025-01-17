const Category = require('../models/category');

const AWS = require('aws-sdk');
require("dotenv").config(); // Load environment variables from .env file

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
    apiVersion: "latest",
});

// Updated translate function with caching
async function translateText(text, targetLang) {
    const translate = new AWS.Translate();

    if (!text || !targetLang) {
        return res.status(400).json({ error: "Text and target language are required" });
    }

    const params = {
        Text: text,
        SourceLanguageCode: 'en',
        TargetLanguageCode: targetLang,
    };

    try {
        const response = await translate.translateText(params).promise();
        const translatedText = response;

        if ((text === "sports" || text === "Sports") && targetLang === "hi") {
            return 'खेल'
        } else if (text === "apple" || text === "Apple" && targetLang === "hi") {
            return 'एप्पल'
        }

        return translatedText?.TranslatedText;
    } catch (error) {
        console.error("Error during translation:", error);
        throw new Error("Translation failed");
    }
}

// Get all categories
const getCategories = async (req, res) => {
    const { lang = "en" } = req.query;

    try {
        const categories = await Category.find();

        if (lang === "en") {
            return res.status(200).json(categories);
            // Return posts as is if language is "en"
        }

        const translatedCategories = await Promise.all(
            categories.map(async (category) => {
                const translatedKey = await translateText(category.name, lang);

                // Handle translation of tags
                const translatedSubCategories = await Promise.all(
                    category.subCats.map(async (subCategory) => {
                        const translatedSubCat = await translateText(subCategory, lang);
                        return translatedSubCat;
                    })
                );

                const updatedPost = {
                    ...category.toObject(),
                    name: translatedKey,
                    subCats: translatedSubCategories,
                };

                return updatedPost;
            })
        );

        // Return translated categories
        return res.status(200).json(translatedCategories);
    } catch (error) {
        console.error("Error translating categories:", error);
        res.status(500).json({ error: "Failed to translating categories" });
    }
};

// Get a single category by key
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findOne({ id });
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch category" });
    }
};

// Add a new category
const addCategory = async (req, res) => {
    const { key, name, dropdown, subCats } = req.body;
    try {
        const newCategory = new Category({ key, name, dropdown, subCats });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: "Failed to add category" });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    // const { key } = req.params;
    const { name, dropdown, subCats } = req.body;
    try {
        const updatedCategory = await Category.findOneAndUpdate(
            // { key },
            { id },
            { name, dropdown, subCats },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ error: "Category not found" });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: "Failed to update category" });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { key } = req.params;
    try {
        const deletedCategory = await Category.findOneAndDelete({ key });
        if (!deletedCategory) return res.status(404).json({ error: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete category" });
    }
};


module.exports = {
    getCategories,
    getCategoryById,

    addCategory,
    updateCategory,
    deleteCategory,
};
