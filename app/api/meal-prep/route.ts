import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Schema for meal preparation tasks
const taskSchema = z.object({
    description: z.string(),
    completed: z.boolean().default(false)
});

// Schema for meal preparation steps
const stepSchema = z.object({
    step: z.string(),
    duration: z.string(),
    tasks: z.array(z.string()),
    tips: z.string(),
    icon: z.string()
});

// Schema for meal preparation
const mealPrepSchema = z.object({
    title: z.string(),
    description: z.string(),
    totalTime: z.string(),
    scheduledDate: z.string(),
    steps: z.array(stepSchema),
    status: z.enum(['planned', 'in_progress', 'completed']).default('planned'),
    userId: z.string().optional()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = mealPrepSchema.parse(body);

        const db = await connectDB();
        const mealPrepsCollection = db.collection('meal_preparations');

        const result = await mealPrepsCollection.insertOne({
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const createdMealPrep = await mealPrepsCollection.findOne({ _id: result.insertedId });

        return NextResponse.json(createdMealPrep, { status: 201 });
    } catch (error) {
        console.error('Error creating meal preparation:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid meal preparation data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create meal preparation' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const db = await connectDB();
        const mealPrepsCollection = db.collection('meal_preparations');

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const userId = searchParams.get('userId');

        // Build query
        const query: any = {};
        if (status) query.status = status;
        if (userId) query.userId = userId;

        const mealPreps = await mealPrepsCollection
            .find(query)
            .sort({ scheduledDate: -1, createdAt: -1 })
            .toArray();

        return NextResponse.json(mealPreps);
    } catch (error) {
        console.error('Error fetching meal preparations:', error);
        return NextResponse.json({ error: 'Failed to fetch meal preparations' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Meal preparation ID is required' }, { status: 400 });
        }

        const body = await req.json();
        const validatedData = mealPrepSchema.partial().parse(body);

        const db = await connectDB();
        const mealPrepsCollection = db.collection('meal_preparations');

        const result = await mealPrepsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...validatedData,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json({ error: 'Meal preparation not found' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating meal preparation:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid meal preparation data', details: error.errors }, { status: 400 });
        }
        if (error instanceof Error && error.message.includes('ObjectId')) {
            return NextResponse.json({ error: 'Invalid meal preparation ID' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update meal preparation' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Meal preparation ID is required' }, { status: 400 });
        }

        const db = await connectDB();
        const mealPrepsCollection = db.collection('meal_preparations');

        const result = await mealPrepsCollection.findOneAndDelete({ _id: new ObjectId(id) });

        if (!result) {
            return NextResponse.json({ error: 'Meal preparation not found' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error deleting meal preparation:', error);
        if (error instanceof Error && error.message.includes('ObjectId')) {
            return NextResponse.json({ error: 'Invalid meal preparation ID' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to delete meal preparation' }, { status: 500 });
    }
} 