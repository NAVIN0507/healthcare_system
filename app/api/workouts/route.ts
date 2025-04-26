import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Workout from '@/app/models/Workout';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const data = await req.json();

        // Basic validation
        if (!data.title || !data.description || !data.category || !data.difficulty || !data.duration) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: ['Title, description, category, difficulty, and duration are required']
            }, { status: 400 });
        }

        const workoutData = {
            title: data.title,
            description: data.description,
            difficulty: data.difficulty,
            duration: data.duration,
            frequency: data.frequency || 'Weekly',
            category: data.category,
            exercises: data.exercises || []
        };

        const workout = await Workout.create(workoutData);
        return NextResponse.json(workout, { status: 201 });
    } catch (error: any) {
        console.error('Error creating workout:', error);
        return NextResponse.json({
            error: 'Failed to create workout',
            details: [error.message]
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const workouts = await Workout.find().sort({ createdAt: -1 });
        return NextResponse.json({ workouts });
    } catch (error: any) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json({
            error: 'Failed to fetch workouts',
            details: [error.message]
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const { id, ...updateData } = await req.json();

        const workout = await Workout.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!workout) {
            return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
        }

        return NextResponse.json(workout);
    } catch (error: any) {
        console.error('Error updating workout:', error);
        return NextResponse.json({
            error: 'Failed to update workout',
            details: [error.message]
        }, { status: 500 });
    }
} 