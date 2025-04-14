import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 relative z-10">
              <div className="inline-block">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/20 text-primary-100 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary-200 mr-2"></span>
                  Your Personal Wellness Companion
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Complete <span className="text-primary-200">Wellness</span> Journey
              </h1>
              <p className="text-lg md:text-xl text-primary-100 max-w-lg">
                Track your health, plan your meals, monitor your fitness, and achieve your wellness goals with Wellnest - your personalized health companion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-primary-700 transition-colors"
                >
                  Explore Features
                </Link>
              </div>
              <div className="pt-6 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-primary-500 flex items-center justify-center text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-primary-200">
                  <span className="font-semibold">10,000+</span> users trust Wellnest
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] w-full">
                {/* Main Image */}
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-white rounded-lg shadow-2xl overflow-hidden transform rotate-3">
                  <Image
                    src="/images/wellness-dashboard.jpg"
                    alt="Wellness Dashboard"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Floating Elements */}
                <div className="absolute top-1/4 left-0 w-1/3 h-1/3 bg-primary-500/20 rounded-lg backdrop-blur-sm p-4 transform -rotate-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Health Goals Achieved</span>
                  </div>
                </div>
                <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-accent-500/20 rounded-lg backdrop-blur-sm p-4 transform rotate-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Fitness Progress</span>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-1/4 w-4 h-4 bg-primary-300 rounded-full"></div>
                <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-primary-200 rounded-full"></div>
                <div className="absolute top-1/3 right-0 w-3 h-3 bg-primary-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-500 mb-4">Comprehensive Wellness Features</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Wellnest provides everything you need to track, improve, and maintain your health and wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Personalized Dashboard</h3>
              <p className="text-neutral-600">
                Customize your dashboard to track the metrics that matter most to you. Monitor your health, fitness, and nutrition all in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Health Tracking</h3>
              <p className="text-neutral-600">
                Log vital signs, medications, symptoms, and more. Set reminders and receive notifications to stay on top of your health routine.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Meal Planning</h3>
              <p className="text-neutral-600">
                Discover healthy recipes, create meal plans, and generate shopping lists. Track your nutrition and dietary goals with ease.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Fitness Tracking</h3>
              <p className="text-neutral-600">
                Log workouts, track progress, and access exercise libraries. Set fitness goals and monitor your achievements over time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Goal Setting</h3>
              <p className="text-neutral-600">
                Set personalized wellness goals and receive smart notifications. Celebrate milestones and track your progress with detailed reports.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-soft p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Educational Content</h3>
              <p className="text-neutral-600">
                Access expert articles, wellness tips, and educational resources. Stay informed with the latest health and fitness information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-500 mb-4">How Wellnest Works</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Your journey to better health and wellness in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Create Your Profile</h3>
              <p className="text-neutral-600">
                Sign up and tell us about your health goals, preferences, and current wellness status.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Customize Your Dashboard</h3>
              <p className="text-neutral-600">
                Build your personalized wellness dashboard with the features and tracking tools you need.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-accent-500 mb-2">Track & Improve</h3>
              <p className="text-neutral-600">
                Monitor your progress, receive personalized recommendations, and achieve your wellness goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Join thousands of users who are already improving their health and wellness with Wellnest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-primary-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
