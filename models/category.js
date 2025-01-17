const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dropdown: { type: Boolean, default: false },
  subCats: { type: [String], default: [] }
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;