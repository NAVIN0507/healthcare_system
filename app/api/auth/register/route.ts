import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import User from '../../../models/User';

export async function POST(request: Request) {
    try {
        // Connect to the database
        await connectDB();

        // Get the request body
        const body = await request.json();
        console.log('Registration request body:', body);

        // Check if user already exists
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create new user with required fields
        const user = await User.create({
            firstName: body.firstName || '',
            lastName: body.lastName || '',
            email: body.email,
            password: body.password,
            dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
            gender: body.gender || undefined,
            height: body.height ? parseFloat(body.height) : undefined,
            weight: body.weight ? parseFloat(body.weight) : undefined,
            bloodType: body.bloodType || undefined,
            allergies: body.allergies || '',
            currentHealthIssues: body.currentHealthIssues || '',
            pastMedicalIssues: body.pastMedicalIssues || ''
        });

        return NextResponse.json(
            { message: 'User registered successfully' },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }

            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationErrors
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error registering user' },
            { status: 500 }
        );
    }
} 