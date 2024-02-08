const order = require ('../models/order');
const product = require('../models/productproduct');

const ErrorHandler = require("../utils/errorHandler");
const  catchAsyncErrors = require ("../middlewares/catchAsyncErrors") ;

exports.newOrder = catchAsyncErrors(async (req, res ,next) => {
    const {

        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await order.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
        paidAt: Data.now(),
        user: req.user._id

    })

    res.status(200).json({
        success : true,
        order
    })
    
})


//Get single order   =>    /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors( async (req,res, next)=>{
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(!order) {
        return next ( new ErrorHandler("No order found with that ID", 404))
    }

    res.status(200).json({
        success : true,
        order
    })
})


//Get logged in user orders   =>    /api/v1/orders/me
exports.myOrder = catchAsyncErrors( async (req,res, next)=>{
    const order = await Order.find({ user: req.user.id})

    res.status(200).json({
        success : true,
        order
    })
})


//Get all orders - ADMIN   =>    /api/v1/admin/orders/
exports.allOrder = catchAsyncErrors( async (req,res, next)=>{
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success : true,
        totalAmmount,
        orders
    })
})

//Update / process  order - ADMIN   =>    /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors( async (req,res, next)=>{
    const order = await Order.findById(req,params.id);

   if (order.orderStatus  === 'Delivered'){
       return next(new ErrorHandler('This order has already been delivered',400))
   }

   order.orderItems.forEach(async item => {

    await updateStock(item.product, item.quantity) 
   })

   order.orderStatus = req.body.status,
   order.deliveredAt = Date.now();

   await order.save()

    res.status(200).json({
        success : true
    })
})


async function updateStock(id,quantity){
    const product = await product.findById(id);

    product.stock =  product.stock - quantity

    await product.save({ validateBeforeSave: false })
}


//Delete order   =>    /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors( async (req,res, next)=>{
    const order = await Order.findById(req.params.id)

    if(!order) {
        return next ( new ErrorHandler("No order found with that ID", 404))
    }

    await order.remove()

    res.status(200).json({
        success : true
    })
})