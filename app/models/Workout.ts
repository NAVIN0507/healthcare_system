import mongoose, { Schema, models, model } from 'mongoose';

interface IExercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
}

interface IWorkout {
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    frequency: string;
    category: string;
    exercises: IExercise[];
}

const exerciseSchema = new Schema<IExercise>({
    name: String,
    sets: Number,
    reps: String,
    rest: String
});

const workoutSchema = new Schema<IWorkout>({
    title: String,
    description: String,
    difficulty: String,
    duration: String,
    frequency: String,
    category: String,
    exercises: [exerciseSchema]
}, {
    timestamps: true
});

// Delete the existing model if it exists
if (models.Workout) {
    delete models.Workout;
}

// Create and export the model
const Workout = model<IWorkout>('Workout', workoutSchema);
export default Workout; 