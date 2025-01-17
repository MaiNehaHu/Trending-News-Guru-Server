const express = require('express');
const router = express.Router();
const {
    getLocationsList,
    addLocationList,
    updateLocationList,
    deleteLocationList,
} = require('../controllers/locationsList');

// Routes
router.get('/', getLocationsList);

router.post('/', addLocationList);
router.put('/:id', updateLocationList);
router.delete('/:id', deleteLocationList);

module.exports = router;