import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import Community from '@/app/models/Community';
import { z } from 'zod';
import connectDB from '@/app/lib/db';

// Schema for validating community creation request
const createCommunitySchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().max(500),
    category: z.enum(['Fitness', 'Nutrition', 'Weight Loss', 'Mental Health', 'General']),
    isPrivate: z.boolean().optional(),
    rules: z.array(z.string()).optional(),
    image: z.string().url().optional(),
    coverImage: z.string().url().optional(),
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
       await connectDB()

        // Parse and validate request body
        const body = await req.json();
        const validatedData = createCommunitySchema.parse(body);

        // Check if community name already exists
        const existingCommunity = await Community.findOne({ name: validatedData.name });
        if (existingCommunity) {
            return NextResponse.json(
                { error: 'Community with this name already exists' },
                { status: 409 }
            );
        }

        // Create new community
        const community = await Community.create({
            ...validatedData,
            creator: session.user.id,
            members: [session.user.id], // Add creator as first member
            moderators: [session.user.id], // Add creator as first moderator
        });

        return NextResponse.json(community, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error creating community:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Connect to database
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const query = searchParams.get('query');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Build query object
        const queryObj: any = {};
        if (category) queryObj.category = category;
        if (query) {
            queryObj.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await Community.countDocuments(queryObj);

        // Fetch communities with pagination
        const communities = await Community.find(queryObj)
            .populate('creator', 'name image')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            communities,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching communities:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 