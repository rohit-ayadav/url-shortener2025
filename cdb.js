const mongoose = require("mongoose");
const Product = require("./models/Product");
const connectDB = require("./config/db");

const products = [
    {
        id: "basic",
        name: "Basic Plan",
        description: "Basic subscription for RUShort with essential features.",
        price: 99,
        currency: "INR",
        visibility: "paid",
    },
    {
        id: "pro",
        name: "Pro Plan",
        description: "Pro subscription with advanced features.",
        price: 299,
        currency: "INR",
        visibility: "paid",
    },
    {
        id: "enterprise",
        name: "Enterprise Plan",
        description: "Enterprise-level subscription with all features unlocked.",
        price: 999,
        currency: "INR",
        visibility: "paid",
    },
    {
        id: "recently-funded-startup-list-of-india",
        name: "Recently Funded Startup List of India",
        description: "A curated list of recently funded startups in India.",
        price: 499,
        currency: "INR",
        visibility: "paid",
    },
];

const insertProducts = async () => {
    try {
        await connectDB();
        await Product.insertMany(products);
        console.log("Products inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting products:", error);
        mongoose.connection.close();
    }
};

insertProducts();
