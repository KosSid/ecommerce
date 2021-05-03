const Sub = require('../models/sub');
const Product = require('../models/product')
const slugify = require('slugify');

exports.create = async (req, res) => {
    try{
        // we create Category based on data from frontEnd based on name object
        const {name, parent} = req.body;
        const sub = await new Sub(
            {
                name,
                parent,
                slug: slugify(name).toLowerCase()
            }).save();
        res.json(sub);
    } catch (err) {
        // console.log(err)
        res.status(400).send(err.message);
    }
}

exports.list = async (req, res) => {
    // get entire list with find and empty object param / sort it / and excute
    const list = await Sub.find({}).sort({createdAt: -1}).exec();
    res.json(list);
}

// exports.read = async (req, res) => {
//     // get gategory base don slug -> apply / sone / dell ...
//     const sub = await Sub.findOne({slug: req.params.slug}).exec();
//     res.json(sub);
// }

exports.read = async (req, res) => {
    let sub = await Sub.findOne({ slug: req.params.slug }).exec();
    const products = await Product.find({ subs: sub })
        .populate("category")
        .exec();

    res.json({
        sub,
        products,
    });
};

exports.update = async (req, res) => {
    //update name and slug in the category; we can upadte name as we have only name in Schema
    const {name, parent} = req.body; // in the requet
    try{
        const newName = await Sub.findOneAndUpdate(
            {slug: req.params.slug},
            {
                name: name,
                parent: parent,
                slug: slugify(name).toLowerCase()
            },
            {new: true}
        );
        res.json(newName);
    } catch(err) {
        res.status(400).send(err.message);
    }
}

exports.remove = async (req, res) => {
    try {
        const del = await Sub.findOneAndDelete({slug: req.params.slug})
        res.json(del)

    } catch(err) {
        res.status(400).send(err.message);
    }
}
