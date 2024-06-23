const express = require('express');
const signUp = require('./signUp');
const signIn = require('./signIn');

const router = express.Router();

router.use('/signUp', signUp);
router.use('/signIn', signIn);

module.exports = router