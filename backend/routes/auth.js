const express = require ('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    logout,
    getUserProfile,
    forgotPassword, 
    resetPassword,
    updatePassword,
    updateProfile,
    AllUsers,
    getUserDetails,
    updateUser,
    deleteUser

    } = require ('../controllers/authController');

const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const { isAuthenticatedUser } = require('../middlewares/auth');
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)

router.route('/admin/user').get(isAuthenticatedUser, authorizeRoles('admin'), AllUsers)
router.route('/admin/user/:id')
            .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
            .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
            .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)



module.exports = router;