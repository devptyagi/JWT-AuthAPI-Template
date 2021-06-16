const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    encrypted_password: {
        type: String,
        required: true
    },
    salt: String
}, {
    timestamps: true
});

// Virtual field for actual pasword.
userSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv4();
        this.encrypted_password = this.securePassword(password);
    })
    .get(function() {
        return this._password;
    })

// Custom methods for User Schema.
userSchema.methods = {

    // Authenticate by verifying password.
    authenticate: function(plainpassword) {
        return this.securePassword(plainpassword) === this.encrypted_password;
    },

    // Encrypt the plain password and store it in the
    // encrypted_password field.
    securePassword: function(plainpassword) {
        if(!plainpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainpassword)
                .digest('hex')
        } catch(err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);