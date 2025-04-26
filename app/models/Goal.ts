import mongoose, { Schema, models, model } from 'mongoose';

interface IGoal {
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
}

const goalSchema = new Schema<IGoal>({
    title: String,
    description: String,
    category: String,
    targetValue: Number,
    currentValue: { type: Number, default: 0 },
    unit: String,
    startDate: { type: Date, default: Date.now },
    targetDate: Date,
    status: { type: String, default: 'Not Started' },
    progress: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Calculate progress before saving
goalSchema.pre('save', function (next) {
    if (this.targetValue && this.currentValue) {
        this.progress = Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
    }
    next();
});

// Delete the existing model if it exists
if (models.Goal) {
    delete models.Goal;
}

// Create and export the model
const Goal = model<IGoal>('Goal', goalSchema);
export default Goal; 