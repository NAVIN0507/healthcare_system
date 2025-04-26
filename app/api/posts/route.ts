import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/app/models/Post';
import mongoose from 'mongoose';

// Create a default author document
const defaultAuthor = {
    _id: new mongoose.Types.ObjectId(),
    name: "Anonymous User",
    image: "/default-avatar.png"
};

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { title, content, category, tags = [] } = body;

        // Create new post without checking authorization
        const post = await Post.create({
            title,
            content,
            category,
            tags,
            isPublished: true,
            author: defaultAuthor._id
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to create post' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Map over the posts to ensure each has valid author information
        const postsWithAuthor = posts.map(post => ({
            ...post,
            author: post.author ? post.author : defaultAuthor,
            community: post.community || null
        }));

        const total = await Post.countDocuments();

        return NextResponse.json({
            posts: postsWithAuthor,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch posts' },
            { status: 500 }
        );
    }
} 