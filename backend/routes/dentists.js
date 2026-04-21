const conn = require('../db/conn');
const express = require('express');
const router = express.Router();

const dentistController = require('../controllers/dentistController');

router.post('/register', dentistController.registerDentist);

module.exports = router;