const product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

//settings dotenv file
dotenv.config({ path : 'backend/config/config.env'})

connectDatabase();

const seedProducts = async () => {
    try{
        await product.deleteMany();
        console.log('Products are deleted');

        await product.insertMany(products)
        console.log('AllProducts are added. ')
        process.exit()

    } catch(errror) {
        console.log(error.message);
        process.exit();
        
    }
}

seedProducts ()