const User = require('../models/user');

// Middleware
// Used whenever there is :userID in the request url params.
// Uses the userID param to find the user in the database and
// populates a new req.profile field in the req.
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                success: false,
                error: 'User not found!'
            })
        }
        req.profile = user;
        next();
    })
}

// Get User
// Called after the getUserByID middleware, returns the user object from req.profile.
exports.getUser = (req, res) => {
    const {_id, username, email} = req.profile;
    return res.json({id: _id, username, email});
}

// Update User
// Called after getUserByID middleware, uses the User ID from req.profile.id 
// to find and update the user in the database.
exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    success: false,
                    error: 'Update Unsuccesful'
                })
            }
            const {_id, username, email} = user;
            res.json({
                success: true,
                user: {
                    id: _id,
                    username,
                    email
                }
            });
        }
    )
}
