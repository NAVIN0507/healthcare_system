import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    author: mongoose.Types.ObjectId;
    title: string;
    content: string;
    category: string;
    images: string[];
    likes: mongoose.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[];
    tags: string[];
    isPublished: boolean;
    community?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Progress', 'Question', 'Discussion', 'Tips', 'Other'],
        default: 'Other'
    },
    images: [{
        type: String,
        validate: {
            validator: function (v: string) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Invalid image URL format'
        }
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    tags: [{
        type: String,
        trim: true
    }],
    isPublished: {
        type: Boolean,
        default: true
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community'
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ community: 1 });
postSchema.index({ createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function (this: IPost) {
    return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function (this: IPost) {
    return this.comments.length;
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', postSchema); 