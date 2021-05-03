const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

exports.create = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title); // slugify title and add it in body
        const newProduct = await new Product(req.body).save(); // to save new Product in the database
        res.json(newProduct); // get it i the response
    } catch (err) {
        console.log(err);
        // res.status(400).send("Create product failed on SERVER (controllers)");
        res.status(400).json({
            err: err.message
        })
    }
};

exports.listAll = async (req, res) => {
    const products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createdAt', 'desc']])
        .exec()
    res.status(200).json(products);
}


exports.remove = async (req, res) => {
    try{
        const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
        res.json(deleted);

    } catch(err) {
       console.log(err)
       res.status(400).send('SERVER CONTROLLERS: Product delete Failed');
    }
}

exports.read = async (req, res) => {
    try{
        const product = await Product.findOne({slug: req.params.slug})
            .populate('category')
            .populate('subs')
            .exec();
        res.json(product);
    } catch(err) {
        console.log(err)
        res.status(400).send('SERVER CONTROLLERS: Product read Failed');
    }
}

exports.update = async (req, res) => {
    try{
        if(req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true})
            .exec();
        res.json(updated);
    } catch(err) {
        console.log('PRODUCT UPDATE ERROR SERVER ---------->>',err)
        res.status(400).send('SERVER CONTROLLERS: Product update Failed');
    }
}

// -------------WITHOUT PAGINATION
// exports.list = async (req, res) => {
//     try{
//         const {sort, order, limit} = req.body;
//         const products = await Product.find({})
//             .populate('categories')
//             .populate('subs')
//             .sort([[sort, order]])
//             .limit(limit)
//             .exec()
//         res.json(products);
//     } catch(err) {
//         console.log('PRODUCT LIST ON HOME PAGE SERVER ERROR ---------->>',err)
//         res.status(400).send('SERVER CONTROLLERS: Product LIST on HOME Page Failed');
//     }
// }

// -------------WITH PAGINATION
exports.list = async (req, res) => {
    try{
        const {sort, order, page} = req.body;

        const currentPage = page || 1;
        const perPage = 3; // 3
        const skip = (currentPage - 1) * perPage

        const products = await Product.find({})
            .skip(skip)
            .populate('categories')
            .populate('subs')
            .sort([[sort, order]])
            .limit(perPage)
            .exec()
        res.json(products);
    } catch(err) {
        console.log('PRODUCT LIST ON HOME PAGE SERVER ERROR ---------->>',err)
        res.status(400).send('SERVER CONTROLLERS: Product LIST on HOME Page Failed');
    }
}

exports.productsCount = async (req, res) => {
    try{
        const total = await Product.find({}).estimatedDocumentCount().exec();
        res.json(total);
    } catch(err) {
        console.log('PRODUCT COUNT ON HOME PAGE SERVER ERROR ---------->>',err)
        res.status(400).send('SERVER CONTROLLERS: Product COUNT on HOME Page Failed');
    }
}

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    // Product ratings it's an array with object of ratings so we can use find
    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star: star, postedBy: user._id } },
            },
            { new: true }
        ).exec();
        console.log("SERVER response ratingAdded", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec();
        console.log("SERVER response ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
};

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec(); // find the product

    // find all related products based on category
    // filter based on id => $ne means all ID's except the current one amd category that equal to the product category
    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(3)
        .populate("category")
        .populate("subs")
        .populate("postedBy")
        .exec();

    res.json(related);
};

// Search Filter

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();
    res.json(products);
};

const handlePrice = async (req, res, price) => {
    try {
        //we ask a database to find a product between 2 values in $gte -> lowest; $lte -> highest
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate("category", "_id name")
            .populate("subs", "_id name")
            .populate("postedBy", "_id name")
            .exec();
        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate("category", "_id name")
            .populate("subs", "_id name")
            .populate("postedBy", "_id name")
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: "$$ROOT",
                // title: "$title",
                floorAverage: {
                    $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
                },
            },
        },
        { $match: { floorAverage: stars } },
    ])
        .limit(12)
        .exec((err, aggregates) => {
            if (err) console.log("AGGREGATE ERROR", err);
            Product.find({ _id: aggregates })
                .populate("category", "_id name")
                .populate("subs", "_id name")
                .populate("postedBy", "_id name")
                .exec((err, products) => {
                    if (err) console.log("PRODUCT AGGREGATE ERROR", err);
                    res.json(products);
                });
        });
};

const handleSub = async (req, res, sub) => {
    const products = await Product.find({ subs: sub })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();

    res.json(products);
};

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();

    res.json(products);
};

const handleColor = async (req, res, color) => {
    const products = await Product.find({ color })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();

    res.json(products);
};

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();

    res.json(products);
};

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub, shipping, color, brand } = req.body;

    if (query) {
        console.log("query --->", query);
        await handleQuery(req, res, query);
    }

    // price [20, 200]
    if (price !== undefined) {
        console.log("price ---> ", price);
        await handlePrice(req, res, price);
    }

    if (category) {
        console.log("category ---> ", category);
        await handleCategory(req, res, category);
    }

    if (stars) {
        console.log("stars ---> ", stars);
        await handleStar(req, res, stars);
    }

    if (sub) {
        console.log("sub ---> ", sub);
        await handleSub(req, res, sub);
    }

    if (shipping) {
        console.log("shipping ---> ", shipping);
        await handleShipping(req, res, shipping);
    }

    if (color) {
        console.log("color ---> ", color);
        await handleColor(req, res, color);
    }

    if (brand) {
        console.log("brand ---> ", brand);
        await handleBrand(req, res, brand);
    }
};
