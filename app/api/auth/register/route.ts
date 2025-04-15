import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import User from '../../../models/User';

export async function POST(request: Request) {
    try {
        // Connect to the database
        await connectDB();

        // Get the request body
        const body = await request.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create new user
        const user = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            gender: body.gender,
            dateOfBirth: new Date(body.dateOfBirth),
            height: body.height,
            weight: body.weight,
            bloodType: body.bloodType,
            pastMedicalIssues: body.pastMedicalIssues,
            allergies: body.allergies,
            currentHealthIssues: body.currentHealthIssues
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: userResponse
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { error: 'Validation failed', details: validationErrors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error registering user' },
            { status: 500 }
        );
    }
} 