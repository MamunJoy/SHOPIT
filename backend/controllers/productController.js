const product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')


//create new product   => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors (async (req,res , next) => {
 
    const product = await product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


// Get all Products =>   /api/v1/products ? keyword = Apple
exports.getProducts = catchAsyncErrors ( async (reg, res, next) => {

    const resPerPage = 4;
    const productCount = await product.countDocuments();

    const apiFeatures = new APIFeatures (product.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage)


    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products

        // message: 'This route is show all products in database.'
    })
})



// Get single product details  => /api/v1/product/:id 

exports.getSingleProduct =catchAsyncErrors ( async (req, res, next) => {

    const product = await product.findById(req,params.id);

    if(!product) {
        return next (new ErrorHandler('Product not found', 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})



// Update product details  => /api/v1/admin/product/:id 
exports.updateProduct = catchAsyncErrors (async (re,res,next) => {

    let product = await product.findById(req.params.id);

    if(!product) {
        return next (new ErrorHandler('Product not found', 404))
    }

    product = await product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success: true,
        product
    })
})


// delete a product  => /api/v1/admin/product/:id
// delete a product from the list of products => /api/v1/admin/products/:id
exports.deleteProduct =catchAsyncErrors ( async (req, res, next) => {
    const product = await product.findById(req.params.id);

    if(!product) {
        return next (new ErrorHandler('Product not found', 404))
    }


    await product.remove();

    res.status(200).json({
        success: true,
        message: 'product is deleted. '
    })
})