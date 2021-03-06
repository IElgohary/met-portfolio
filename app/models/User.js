const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');

let userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true,
    },
    gucId: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: 'default-pic.png'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                return validator.isEmail(email);
            },
            message: '{VALUE} is an invalid email.'
        }
    },
    portfolio: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkItem'
    }],
    password: {
        type: String,
        required: true
    },
    passwordResetTokenDate: {
        type: Date,
        default: Date.now
    },
    passwordChangeDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.virtual('fullName').get(() => this.firstName + ' ' + this.lastName);

userSchema.pre('save', function (done) {
    var user = this;

    if (!user.isModified('password')) {
        return done();
    }

    bcrypt.hash(user.password, null, null, function (err, hashedPassword) {
        if (err) {
            return done(err);
        }
        user.password = hashedPassword;
        return done();
    });
});

userSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, matching) {
        return done(err, matching);
    });
};

module.exports = mongoose.model('User', userSchema);