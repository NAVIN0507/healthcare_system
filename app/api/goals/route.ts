import { NextResponse } from 'next/server';
import { clientPromise } from '@/app/lib/db';
import { z } from 'zod';

// Schema for validating goal creation request
const createGoalSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    category: z.enum(['Weight Loss', 'Muscle Gain', 'Cardio', 'Strength', 'Nutrition', 'Mental Health', 'Other']),
    targetValue: z.number().positive(),
    currentValue: z.number().min(0).optional(),
    unit: z.string(),
    startDate: z.string(),
    targetDate: z.string(),
    reminders: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'none']),
        time: z.string(),
        enabled: z.boolean()
    }).optional()
});

interface Goal {
    title: string;
    description?: string;
    targetValue: number;
    currentValue: number;
    progress: number;
    status: 'In Progress' | 'Completed';
    userEmail: string;
    createdAt: Date;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Received data:', body);

        const validatedData = createGoalSchema.parse(body);
        console.log('Validated data:', validatedData);

        const client = await clientPromise;
        const db = client.db('healthcare_system');
        const goalsCollection = db.collection('goals');

        const newGoal = {
            ...validatedData,
            createdAt: new Date(),
            currentValue: validatedData.currentValue || 0,
            progress: 0,
            status: 'In Progress'
        };

        console.log('Saving goal:', newGoal);
        const result = await goalsCollection.insertOne(newGoal);
        console.log('Insert result:', result);

        return NextResponse.json({
            success: true,
            goal: { ...newGoal, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error creating goal:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation error',
                details: error.errors
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Failed to create goal',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('healthcare_system');
        const goalsCollection = db.collection('goals');

        const goals = await goalsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ goals });
    } catch (error) {
        console.error('Error fetching goals:', error);
        return NextResponse.json({
            error: 'Failed to fetch goals',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 