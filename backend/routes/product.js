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


router.route('/products').get(getProducts);
router.route('/products/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, newProduct);

router.route('/admin/products/:id')
        .put(isAuthenticatedUser, updateProduct)
        .delete(isAuthenticatedUser, deleteProduct);

module.exports = router;

