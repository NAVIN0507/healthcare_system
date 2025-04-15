import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/app/models/Goal';
import { z } from 'zod';

// Schema for validating goal updates
const updateGoalSchema = z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    category: z.enum(['Weight Loss', 'Muscle Gain', 'Cardio', 'Strength', 'Nutrition', 'Mental Health', 'Other']).optional(),
    targetValue: z.number().positive().optional(),
    currentValue: z.number().min(0).optional(),
    unit: z.string().optional(),
    targetDate: z.string().transform(str => new Date(str)).optional(),
    status: z.enum(['Not Started', 'In Progress', 'On Track', 'Behind Schedule', 'Completed', 'Abandoned']).optional(),
    milestones: z.array(
        z.object({
            value: z.number(),
            achieved: z.boolean().optional(),
            achievedDate: z.string().transform(str => new Date(str)).optional(),
        })
    ).optional(),
    reminders: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'none']).optional(),
        time: z.string().optional(),
        enabled: z.boolean().optional(),
    }).optional(),
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

        await dbConnect();

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

export async function PATCH(
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

        await dbConnect();

        // Check authorization
        if (!(await isAuthorized(params.id, session.user.id))) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Parse and validate request body
        const body = await req.json();
        const validatedData = updateGoalSchema.parse(body);

        // Update goal
        const updatedGoal = await Goal.findByIdAndUpdate(
            params.id,
            { $set: validatedData },
            { new: true, runValidators: true }
        );

        if (!updatedGoal) {
            return NextResponse.json(
                { error: 'Goal not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedGoal);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error updating goal:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        await dbConnect();

        // Check authorization
        if (!(await isAuthorized(params.id, session.user.id))) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Delete goal
        const deletedGoal = await Goal.findByIdAndDelete(params.id);

        if (!deletedGoal) {
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
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 