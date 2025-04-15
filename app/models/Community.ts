import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
    name: string;
    description: string;
    category: string;
    creator: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    moderators: mongoose.Types.ObjectId[];
    rules: string[];
    isPrivate: boolean;
    image?: string;
    coverImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const communitySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Community name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Community name must be at least 3 characters long'],
        maxlength: [50, 'Community name cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Community description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Fitness', 'Nutrition', 'Weight Loss', 'Mental Health', 'General'],
        default: 'General'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    rules: [{
        type: String,
        trim: true
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Invalid image URL format'
        }
    },
    coverImage: {
        type: String,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Invalid cover image URL format'
        }
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
communitySchema.index({ name: 1 });
communitySchema.index({ category: 1 });
communitySchema.index({ creator: 1 });

// Virtual for member count
communitySchema.virtual('memberCount').get(function (this: ICommunity) {
    return this.members.length;
});

export default mongoose.models.Community || mongoose.model<ICommunity>('Community', communitySchema); 