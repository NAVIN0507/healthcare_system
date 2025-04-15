import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    startDate: Date;
    targetDate: Date;
    status: string;
    progress: number;
    milestones: {
        value: number;
        achieved: boolean;
        achievedDate?: Date;
    }[];
    reminders: {
        frequency: string;
        time: string;
        enabled: boolean;
    };
    isCompleted: boolean;
    completedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const goalSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    title: {
        type: String,
        required: [true, 'Goal title is required'],
        trim: true,
        minlength: [3, 'Goal title must be at least 3 characters long'],
        maxlength: [100, 'Goal title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Goal description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Weight Loss', 'Muscle Gain', 'Cardio', 'Strength', 'Nutrition', 'Mental Health', 'Other'],
        default: 'Other'
    },
    targetValue: {
        type: Number,
        required: [true, 'Target value is required']
    },
    currentValue: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        default: Date.now
    },
    targetDate: {
        type: Date,
        required: [true, 'Target date is required']
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'On Track', 'Behind Schedule', 'Completed', 'Abandoned'],
        default: 'Not Started'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    milestones: [{
        value: {
            type: Number,
            required: true
        },
        achieved: {
            type: Boolean,
            default: false
        },
        achievedDate: {
            type: Date
        }
    }],
    reminders: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'none'],
            default: 'none'
        },
        time: {
            type: String,
            default: '09:00'
        },
        enabled: {
            type: Boolean,
            default: false
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
goalSchema.index({ user: 1, createdAt: -1 });
goalSchema.index({ category: 1 });
goalSchema.index({ status: 1 });
goalSchema.index({ targetDate: 1 });

// Virtual for time remaining
goalSchema.virtual('timeRemaining').get(function (this: IGoal) {
    const now = new Date();
    const remaining = this.targetDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24))); // Returns remaining days
});

// Pre-save middleware to update progress
goalSchema.pre('save', function (next) {
    if (this.targetValue > 0) {
        this.progress = Math.min(100, (this.currentValue / this.targetValue) * 100);
    }

    if (this.progress >= 100 && !this.isCompleted) {
        this.isCompleted = true;
        this.completedDate = new Date();
        this.status = 'Completed';
    }

    next();
});

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', goalSchema); 