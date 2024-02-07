const express = require ('express')
const router = express.Router();


const { 
    getProducts, 
    newproduct,
    getSingleProduct,
    updateProduct,
    deleteProduct 

} = require('../controllers/productController')

const { isAuthenticatedUser } = require("../middlewares/auth");


router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/products/:id').get(getSingleProduct);

router.route('/admin/product/new').post(newProduct);

router.route('/admin/products/:id')
        .put(updateProduct)
        .delete(deleteProduct);

module.exports = router;

