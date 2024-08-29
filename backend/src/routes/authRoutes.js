const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ensure this path is correct and the file exists

router.post('/signup', authController.signup); // Ensure authController.signup is correctly defined
router.post('/signin', authController.signin);

module.exports = router;