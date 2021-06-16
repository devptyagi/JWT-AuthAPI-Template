const express = require('express');
const router = express.Router();

const {getUserById, getUser, updateUser} = require('../controllers/user');
const {isSignedIn, isAuthenticated} = require('../controllers/auth');

// Middleware
router.param('userId', getUserById);

// Get User By ID
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

// Update User By ID
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

module.exports = router;