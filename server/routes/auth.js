const express = require('express');
const router = express.Router();

//middlewares import
const {authCheck, adminCheck} = require('../middlewares/auth')

// import controller => call back funcrion for Routes
const {createOrUpdateUser, currentUser} = require('../controllers/auth')

// --------------------ROUTES

    // 1.  endpoint for create or update user => Login / Complete Registartion
router.post('/create-or-update-user', authCheck, createOrUpdateUser);

    // 2. endpoint for first App update and get data about user fomr DB
router.post('/current-user', authCheck, currentUser);

    // 3. endpoint for first admin => was added adminCheck middelware
    router.post('/current-admin', authCheck, adminCheck, currentUser);

module.exports = router;