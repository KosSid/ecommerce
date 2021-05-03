const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

// New in Sub schema is refferance to parent => we've created the parent object for that

const subSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Name is required',
            minlength: [2, 'To short'],
            maxlength: [32, 'To long'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        parent: {
            type: ObjectId,
            ref: 'Category',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Sub", subSchema); // access to our Sub Category database on Mongo DB