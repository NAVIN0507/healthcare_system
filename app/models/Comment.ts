import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    content: string;
    likes: mongoose.Types.ObjectId[];
    replies: mongoose.Types.ObjectId[];
    parentComment?: mongoose.Types.ObjectId;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for like count
commentSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function () {
    return this.replies.length;
});

// Indexes for better query performance
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);

export default Comment; 