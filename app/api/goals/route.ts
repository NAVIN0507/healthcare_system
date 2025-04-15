import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/app/models/Goal';
import { z } from 'zod';

// Schema for validating goal creation request
const createGoalSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(500),
    category: z.enum(['Weight Loss', 'Muscle Gain', 'Cardio', 'Strength', 'Nutrition', 'Mental Health', 'Other']),
    targetValue: z.number().positive(),
    currentValue: z.number().min(0).optional(),
    unit: z.string(),
    startDate: z.string().transform(str => new Date(str)),
    targetDate: z.string().transform(str => new Date(str)),
    milestones: z.array(
        z.object({
            value: z.number(),
            achieved: z.boolean().optional(),
        })
    ).optional(),
    reminders: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'none']).optional(),
        time: z.string().optional(),
        enabled: z.boolean().optional(),
    }).optional(),
});

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Connect to database
        await dbConnect();

        // Parse and validate request body
        const body = await req.json();
        const validatedData = createGoalSchema.parse(body);

        // Create new goal
        const goal = await Goal.create({
            ...validatedData,
            user: session.user.id,
            status: 'Not Started',
            progress: 0,
        });

        return NextResponse.json(goal, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error creating goal:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Build query object
        const queryObj: any = { user: session.user.id };
        if (category) queryObj.category = category;
        if (status) queryObj.status = status;

        // Get total count for pagination
        const total = await Goal.countDocuments(queryObj);

        // Fetch goals with pagination
        const goals = await Goal.find(queryObj)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            goals,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching goals:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 