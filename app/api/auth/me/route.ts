import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import connectDB from '../../../lib/db';
import User from '../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
    try {
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = verify(token.value, JWT_SECRET) as any;

        // Connect to database
        await connectDB();

        // Get user data
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json({ user: userResponse });

    } catch (error: any) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Error fetching user data' },
            { status: 500 }
        );
    }
} 