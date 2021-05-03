const express = require("express");
const router = express.Router();

// Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// Controller
const {
    create,
    listAll,
    remove,
    read,
    update,
    list,
    productsCount,
    productStar,
    listRelated,
    searchFilters
} = require("../controllers/product");

// ROUTES ORDER is IMPORTANT
router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount); // get the total number of products from server
router.get("/products/:count", listAll); // using count we get the number of products products/100
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.post('/products', list) // get the of products on the home page based on selected number of products we use Post method insted of get as it's easier to give parameter in the body;

//Rating
router.put("/product/star/:productId", authCheck, productStar);

//Related list
router.get("/product/related/:productId", listRelated);

//Search => use post as it's easy to set parameters
router.post("/search/filters", searchFilters);

module.exports = router;