import { Suspense } from 'react';
import LoginPageClient from './LoginpageClient';

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageClient />
        </Suspense>
    );
}
