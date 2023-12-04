const product = require('../models/product')

//create new product   => /api/v1/product/new
exports.newproduct = asyc (req,res , next) => {

    const product = await product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
}
exports.getProducts = (reg, res, next) => {
    res.status(200).json({
        success: true,
        message: 'This route is show all products in database.'
    })
}