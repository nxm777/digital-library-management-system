const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [30, "First name cannot exceed 30 characters"]
    },
    lastName: { 
        type: String, 
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [60, "Last name cannot exceed 60 characters"]
    },
    username: { 
        type: String, 
        required: [true, "Username is required"], 
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [40, "Username cannot exceed 40 characters"],
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"]

    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Please enter a valid email address"
          }
    },
    password: { 
        type: String, 
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true
    },
}, {versionKey: false,
    timestamps: true,
    toJSON: {
        transform: (_, ret) => {
            delete ret.password;
            return ret;
        }
    }
});

userSchema.index({ email: 1, username: 1 });

userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
    
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    
        this.password = hashedPassword;
        next();
      } catch (error) {
            next(error);
      }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);