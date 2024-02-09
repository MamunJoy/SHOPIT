const product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')


//create new product   => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors (async (req,res , next) => {

    req.body.user = req.user.id;
 
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


exports.createProductReview = catchAsyncErrors(async (req,res,next)=>{
    const { rating , comment , productId } = req.body;

    const review ={
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await product.findById(productId);


    const isReviewed= product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
        )

        if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.rating = rating;
                review.comment= comment;
            }

          })  
        }
         else{
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length
     }

     product.ratings =  product.reviews.reduce((acc,item) => item.rating + acc, 0)/product.reviews.length

     await product.save({ validateBeforeSave : false});
     
     res.status(200).json({
         success:true
     })
    
})
 
// Delete Product Reviews    =>      /api/v1/reviews
exports.deleteReview = catchAsyncErrors (async (req,res,next)  =>  {
    const product = await product.findById(req.query.productId);

    const reviews  = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings =  product.reviews.reduce((acc,item) => item.rating + acc, 0)/reviews.length

    await Product .findByIdAndUpdate(req.query.productId , {
        reviews,
        numOfReviews,
        ratings
    }, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })


    res.status(200).json({
       success: true 
    })
})

// Delete Product Review    =>      /api/v1/reviews
exports.getProductReviews = catchAsyncErrors (async (req,res,next)  =>  {
    const product = await product.findById(req.query.id);

    res.status(200).json({
       success: true ,
       reviews: product.reviews
    })
})