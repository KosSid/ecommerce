const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema); // access to our Category database on Mongo DB