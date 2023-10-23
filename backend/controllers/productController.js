
exports.getProducts = (reg, res, next) => {
    res.status(200).json({
        success: true,
        message: 'This route is show all products in database.'
    })
}