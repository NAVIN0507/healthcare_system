import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Goal from '@/app/models/Goal';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const data = await req.json();

        // Create the goal with basic validation
        if (!data.title || !data.description || !data.category || !data.targetValue || !data.unit || !data.targetDate) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: ['All fields are required except currentValue']
            }, { status: 400 });
        }

        const goalData = {
            title: data.title,
            description: data.description,
            category: data.category,
            targetValue: Number(data.targetValue),
            currentValue: Number(data.currentValue || 0),
            unit: data.unit,
            targetDate: new Date(data.targetDate),
            status: 'Not Started',
            progress: 0
        };

        const goal = await Goal.create(goalData);
        return NextResponse.json(goal, { status: 201 });
    } catch (error: any) {
        console.error('Error creating goal:', error);
        return NextResponse.json({
            error: 'Failed to create goal',
            details: [error.message]
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const goals = await Goal.find().sort({ createdAt: -1 });
        return NextResponse.json({ goals });
    } catch (error: any) {
        console.error('Error fetching goals:', error);
        return NextResponse.json({
            error: 'Failed to fetch goals',
            details: [error.message]
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        const { id, ...updateData } = await req.json();

        const goal = await Goal.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json(goal);
    } catch (error: any) {
        console.error('Error updating goal:', error);
        return NextResponse.json({
            error: 'Failed to update goal',
            details: [error.message]
        }, { status: 500 });
    }
} 