const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


// Register User
exports.signup = (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                success: false,
                error: "Invalid Request"
            })
        }
        res.json({
            success: true,
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        });
    })
}

// Sign In User
exports.signin = (req, res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: errors.array()[0].msg
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                success: false,
                error: "Email Not Found"
            })
        }
        if(!user.authenticate(password)) {
            return res.status(401).json({
                success: false,
                error: "Invalid Credentials"
            })
        }

        // Create Token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        // Put token in cookie
        res.cookie('token', token, {expire: new Date() + 9999});

        // Send response to front end
        const {_id, username, email} = user;
        
        return res.json({
            success: true,
            token, 
            user: {id: _id, username, email}
        });
    })

}

// Change User Password.
exports.updateUserPassword = (req, res) => {
    User.findById(req.profile._id).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                success: false,
                error: 'User not found!'
            })
        }
        user.password = req.body.password;
        user.save((err, user) => {
            if(err) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid Request"
                })
            }
            res.json({
                success: true,
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id
                }
            });
        });
    })
}

// Signout
exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "User signed out"
    });
}

// Protected Routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
})

// Custom Middleware
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) {
        return res.status(403).json({
            error: 'ACCESS DENIED'
        });
    }
    next();
}