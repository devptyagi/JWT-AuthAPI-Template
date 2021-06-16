const express = require('express');
const router = express.Router();
const {signout, signup, signin, updateUserPassword} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');
const {isSignedIn, isAuthenticated} = require('../controllers/auth');
const { check } = require('express-validator');

// Middleware
router.param('userId', getUserById);

router.put('/changepassword/:userId', isSignedIn, isAuthenticated, updateUserPassword);

router.post('/signup', [
    check('username')
        .isLength({min: 3})
        .withMessage('Username must be at least 3 characters long.'),
    check('email')
        .isEmail()
        .withMessage('A valid email is required.'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password length must be at least 6')
], signup);

router.post('/signin', [
    check('email')
        .isEmail()
        .withMessage('A valid email is required.'),
    check('password')
        .isLength({min: 6})
        .withMessage('Invalid Password Length!')
], signin);


router.get('/signout', signout);

module.exports = router;