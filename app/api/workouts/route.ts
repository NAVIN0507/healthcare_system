import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("healthcare_system");
        const workoutsCollection = db.collection("workouts");

        const workout = {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await workoutsCollection.insertOne(workout);

        return NextResponse.json({
            message: "Workout created successfully",
            workout: { ...workout, _id: result.insertedId }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating workout:', error);
        return NextResponse.json(
            { error: 'Failed to create workout' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("healthcare_system");
        const workoutsCollection = db.collection("workouts");

        const workouts = await workoutsCollection.find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json(workouts);

    } catch (error) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workouts' },
            { status: 500 }
        );
    }
} 