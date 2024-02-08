const express = require ('express')
const router = express.Router();

const { 
    getProducts, 
    newproduct,
    getSingleProduct,
    updateProduct,
    deleteProduct 

} = require('../controllers/productController')

const { isAuthenticatedUser,authorizeRoles } = require("../middlewares/auth");

// ekhane mongo DB use kora hoyeche , ami calculation kori nai ....eta korte hobe  mone kore . 7(8) => 4.25 min

router.route('/products').get(getProducts);
router.route('/products/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

router.route('/admin/products/:id')
        .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
        .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;

