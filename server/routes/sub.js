const express = require('express');
const router = express.Router();

//middlewares import
const {authCheck, adminCheck} =require('../middlewares/auth')

// IMPORT controller methods => call back funcrion for Routes
const {create, read, update, remove, list} = require('../controllers/sub');

// --------------------ROUTES

// 1.  endpoint for create or update user => Login / Complete Registartion
router.post('/sub', authCheck, adminCheck, create);
router.get('/subs', list);
router.get('/sub/:slug', read);
router.put('/sub/:slug', authCheck, adminCheck, update);
router.delete('/sub/:slug', authCheck, adminCheck, remove);


module.exports = router;