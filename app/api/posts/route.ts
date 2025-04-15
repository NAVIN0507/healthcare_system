import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Post from '@/app/models/Post';
import { connectDB } from '@/lib/database';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const formData = await req.formData();
        const title = formData.get('title');
        const content = formData.get('content');
        const category = formData.get('category');
        const tagsString = formData.get('tags');

        // Validate required fields
        if (!title || !content || !category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const tags = tagsString ? String(tagsString).split(',').map(tag => tag.trim()) : [];

        // Handle image files
        const imageFiles = formData.getAll('images');
        const images: string[] = [];

        // In a real application, you would upload these images to a cloud storage
        // For now, we'll just store the file names
        for (const file of imageFiles) {
            if (file instanceof File) {
                images.push(file.name);
            }
        }

        const post = await Post.create({
            author: session.user.id,
            title: String(title),
            content: String(content),
            category: String(category),
            tags: tags.filter(tag => tag.length > 0),
            images,
            isPublished: true,
            likes: [],
            comments: []
        });

        // Populate the author details before sending the response
        await post.populate('author', 'name image');

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create post' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const posts = await Post.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .populate('author', 'name image')
            .exec();

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
} 