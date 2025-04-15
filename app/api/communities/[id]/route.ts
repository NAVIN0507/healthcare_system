import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import Community from '@/app/models/Community';
import { z } from 'zod';
import connectDB from '@/app/lib/db';

// Schema for validating community updates
const updateCommunitySchema = z.object({
    description: z.string().max(500).optional(),
    category: z.enum(['Fitness', 'Nutrition', 'Weight Loss', 'Mental Health', 'General']).optional(),
    isPrivate: z.boolean().optional(),
    rules: z.array(z.string()).optional(),
    image: z.string().url().optional(),
    coverImage: z.string().url().optional(),
});

// Helper function to check if user is authorized
async function isAuthorized(communityId: string, userId: string) {
    const community = await Community.findById(communityId);
    if (!community) return false;
    return community.creator.toString() === userId ||
        community.moderators.some(mod => mod.toString() === userId);
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const community = await Community.findById(params.id)
            .populate('creator', 'name image')
            .populate('members', 'name image')
            .populate('moderators', 'name image');

        if (!community) {
            return NextResponse.json(
                { error: 'Community not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(community);
    } catch (error) {
        console.error('Error fetching community:', error);
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

        // Validate request body
        const body = await req.json();
        const validatedData = updateCommunitySchema.parse(body);

        // Update community
        const updatedCommunity = await Community.findByIdAndUpdate(
            params.id,
            { $set: validatedData },
            { new: true, runValidators: true }
        ).populate('creator', 'name image');

        if (!updatedCommunity) {
            return NextResponse.json(
                { error: 'Community not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedCommunity);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error updating community:', error);
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

        // Delete community
        const deletedCommunity = await Community.findByIdAndDelete(params.id);

        if (!deletedCommunity) {
            return NextResponse.json(
                { error: 'Community not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Community deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting community:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 