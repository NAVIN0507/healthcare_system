import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/app/lib/db';
import Goal from '@/app/models/Goal';
import { z } from 'zod';
import { clientPromise } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// Schema for validating goal updates
const updateGoalSchema = z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    category: z.enum(['Weight Loss', 'Muscle Gain', 'Cardio', 'Strength', 'Nutrition', 'Mental Health', 'Other']).optional(),
    targetValue: z.number().positive().optional(),
    currentValue: z.number().min(0).optional(),
    unit: z.string().optional(),
    startDate: z.string().optional(),
    targetDate: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    status: z.enum(['In Progress', 'Completed']).optional(),
    reminders: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'none']),
        time: z.string(),
        enabled: z.boolean()
    }).optional()
});

// Helper function to check if user owns the goal
async function isAuthorized(goalId: string, userId: string) {
    const goal = await Goal.findById(goalId);
    if (!goal) return false;
    return goal.user.toString() === userId;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        await connectDB();

        const goal = await Goal.findById(params.id);

        if (!goal) {
            return NextResponse.json(
                { error: 'Goal not found' },
                { status: 404 }
            );
        }

        // Check if the user owns the goal
        if (goal.user.toString() !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        return NextResponse.json(goal);
    } catch (error) {
        console.error('Error fetching goal:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const validatedData = updateGoalSchema.parse(body);

        const client = await clientPromise;
        const db = client.db('healthcare_system');
        const goalsCollection = db.collection('goals');

        const result = await goalsCollection.findOneAndUpdate(
            { _id: new ObjectId(params.id) },
            { $set: validatedData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { error: 'Goal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ goal: result });
    } catch (error) {
        console.error('Error updating goal:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update goal' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db('healthcare_system');
        const goalsCollection = db.collection('goals');

        const result = await goalsCollection.deleteOne({
            _id: new ObjectId(params.id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Goal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Goal deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting goal:', error);
        return NextResponse.json(
            { error: 'Failed to delete goal' },
            { status: 500 }
        );
    }
} 