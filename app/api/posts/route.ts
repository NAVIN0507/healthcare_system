import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Post from '@/app/models/Post';
import { z } from 'zod';

// Schema for validating post creation request
const createPostSchema = z.object({
    title: z.string().min(3).max(200),
    content: z.string().max(5000),
    category: z.enum(['Progress', 'Question', 'Discussion', 'Tips', 'Other']),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
    community: z.string().optional() // community ID
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
        const validatedData = createPostSchema.parse(body);

        // Create new post
        const post = await Post.create({
            ...validatedData,
            author: session.user.id,
        });

        // Populate author details
        await post.populate('author', 'name image');

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const query = searchParams.get('query');
        const tag = searchParams.get('tag');
        const community = searchParams.get('community');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Build query object
        const queryObj: any = { isPublished: true };
        if (category) queryObj.category = category;
        if (tag) queryObj.tags = tag;
        if (community) queryObj.community = community;
        if (query) {
            queryObj.$or = [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await Post.countDocuments(queryObj);

        // Fetch posts with pagination
        const posts = await Post.find(queryObj)
            .populate('author', 'name image')
            .populate('community', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 