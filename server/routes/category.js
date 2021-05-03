const express = require('express');
const router = express.Router();

//middlewares import
const {authCheck, adminCheck} =require('../middlewares/auth')

// IMPORT controller methods => call back funcrion for Routes
const {create, read, update, remove, list, getSubs} = require('../controllers/category');

// --------------------ROUTES

// 1.  endpoint for create or update user => Login / Complete Registartion
router.post('/category', authCheck, adminCheck, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.put('/category/:slug', authCheck, adminCheck, update);
router.delete('/category/:slug', authCheck, adminCheck, remove);
router.get('/category/subs/:_id', getSubs);


module.exports = router;