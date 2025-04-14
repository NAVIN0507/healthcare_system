import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
    // Health Information
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Gender is required']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    height: {
        type: Number,
        required: [true, 'Height is required'],
        min: [50, 'Height must be at least 50cm'],
        max: [250, 'Height must not exceed 250cm']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [20, 'Weight must be at least 20kg'],
        max: [300, 'Weight must not exceed 300kg']
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: [true, 'Blood type is required']
    },
    pastMedicalIssues: {
        type: String,
        trim: true,
        maxlength: [1000, 'Past medical issues cannot exceed 1000 characters']
    },
    allergies: {
        type: String,
        trim: true,
        maxlength: [1000, 'Allergies cannot exceed 1000 characters']
    },
    currentHealthIssues: {
        type: String,
        trim: true,
        maxlength: [1000, 'Current health issues cannot exceed 1000 characters']
    },
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Create and export the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 