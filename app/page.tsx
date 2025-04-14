"use client"
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import dynamic from 'next/dynamic';

// Dynamic import for the 3D model to avoid SSR issues
const WellnessModel = dynamic(() => import('./components/WellnessModel'), { ssr: false });

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Types for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

// Animated counter component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useSpring(count, { duration: duration * 1000 });

  useEffect(() => {
    count.set(value);
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

function Home() {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect for hero section
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Track mouse position for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white mt-8">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 py-24 md:py-32 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-block">
                <motion.span
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-primary-100 text-sm font-medium border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary-200 mr-2 animate-pulse"></span>
                  Your Personal Wellness Companion
                </motion.span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Complete <span className="text-primary-200 relative inline-block">
                  Wellness
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M0 4C50 4 50 0 100 0C150 0 150 8 200 8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span> Journey
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-lg leading-relaxed">
                Track your health, plan your meals, monitor your fitness, and achieve your wellness goals with Wellnest - your personalized health companion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-primary-700 bg-white hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    Get Started
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="#features"
                    className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    Explore Features
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
              <div className="pt-8 flex items-center space-x-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-primary-600 bg-primary-500 flex items-center justify-center text-sm font-bold transform hover:scale-110 transition-transform duration-300"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {i}
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.svg
                        key={i}
                        className="w-5 h-5 text-primary-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        whileHover={{ scale: 1.2, rotate: 15 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  <p className="text-lg text-primary-200">
                    <span className="font-bold">10,000+</span> users trust Wellnest
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[600px] w-full">
                {/* Main Image */}
                <motion.div
                  className="absolute top-0 right-0 w-4/5 h-4/5 bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  animate={{
                    rotate: [3, 0, 3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    x: useTransform(scrollY, [0, 500], [0, 50]),
                  }}
                >
                  <Image
                    src="/images/heroimg.png"
                    alt="Wellness Dashboard"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent"></div>
                </motion.div>
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/4 left-0 w-1/3 h-1/3 bg-white/10 backdrop-blur-md rounded-2xl p-6 transform -rotate-6 border border-white/20 shadow-xl"
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  style={{
                    x: useTransform(scrollY, [0, 500], [0, -30]),
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                    <span className="text-base font-medium">Health Goals Achieved</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-white/10 backdrop-blur-md rounded-2xl p-6 transform rotate-6 border border-white/20 shadow-xl"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  style={{
                    x: useTransform(scrollY, [0, 500], [0, 30]),
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-10 h-10 bg-accent-400 rounded-xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.2, rotate: -10 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </motion.div>
                    <span className="text-base font-medium">Fitness Progress</span>
                  </div>
                </motion.div>
                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-0 right-1/4 w-4 h-4 bg-primary-300 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-primary-200 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                ></motion.div>
                <motion.div
                  className="absolute top-1/3 right-0 w-3 h-3 bg-primary-100 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                ></motion.div>

                {/* Interactive cursor follower */}
                <motion.div
                  className="absolute w-64 h-64 rounded-full bg-primary-500/10 blur-xl pointer-events-none"
                  animate={{
                    x: mousePosition.x - 320,
                    y: mousePosition.y - 320,
                  }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 200,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Powerful Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-accent-500 mb-6">Comprehensive Wellness Features</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Wellnest provides everything you need to track, improve, and maintain your health and wellness journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards with hover effects */}
            {[
              {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Personalized Dashboard",
                description: "Customize your dashboard to track the metrics that matter most to you. Monitor your health, fitness, and nutrition all in one place."
              },
              {
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Health Tracking",
                description: "Log vital signs, medications, symptoms, and more. Set reminders and receive notifications to stay on top of your health routine."
              },
              {
                icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Meal Planning",
                description: "Discover healthy recipes, create meal plans, and generate shopping lists. Track your nutrition and dietary goals with ease."
              },
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Fitness Tracking",
                description: "Log workouts, track progress, and access exercise libraries. Set fitness goals and monitor your achievements over time."
              },
              {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
                title: "Goal Setting",
                description: "Set personalized wellness goals and receive smart notifications. Celebrate milestones and track your progress with detailed reports."
              },
              {
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                title: "Educational Content",
                description: "Access expert articles, wellness tips, and educational resources. Stay informed with the latest health and fitness information."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-soft p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-accent-500 mb-4 relative z-10">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed relative z-10">
                  {feature.description}
                </p>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-primary-500 w-0 group-hover:w-full transition-all duration-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics & Visualization Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Real-Time Analytics
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-accent-500 mb-6">Track Your Progress</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Visualize your wellness journey with interactive charts and real-time statistics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 3D Model Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl overflow-hidden shadow-xl"
            >
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={1}
                  castShadow
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Environment preset="sunset" />
                <OrbitControls
                  enableZoom={false}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 1.5}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={1}
                />
                <WellnessModel />
              </Canvas>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-50/80 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="text-sm text-neutral-600 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm">
                    Interactive 3D Wellness Visualization
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Statistics and Charts */}
            <div className="space-y-8">
              {/* Progress Stats */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Active Users', value: 10000 },
                  { label: 'Goals Achieved', value: 50000 },
                  { label: 'Wellness Score', value: 92 },
                  { label: 'Daily Activities', value: 25000 }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-soft"
                  >
                    <h4 className="text-sm text-neutral-600 mb-2">{stat.label}</h4>
                    <div className="text-3xl font-bold text-accent-500">
                      <AnimatedCounter value={stat.value} />
                      {stat.label === 'Wellness Score' && '%'}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Activity Graph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-soft"
              >
                <h3 className="text-xl font-semibold text-accent-500 mb-4">Monthly Activity Trends</h3>
                <div className="h-[300px]">
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Wellness Score',
                          data: [65, 78, 72, 85, 82, 90],
                          borderColor: 'rgb(99, 102, 241)',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          fill: true,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                        },
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart',
                      },
                    }}
                  />
                </div>
              </motion.div>

              {/* Interactive Metrics */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    label: 'Sleep Quality',
                    value: 85,
                    color: 'from-blue-500 to-purple-500',
                  },
                  {
                    label: 'Nutrition Score',
                    value: 92,
                    color: 'from-green-500 to-emerald-500',
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-soft relative overflow-hidden group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative z-10">
                      <h4 className="text-sm text-neutral-600 mb-2">{metric.label}</h4>
                      <div className="text-3xl font-bold text-white">
                        <AnimatedCounter value={metric.value} />%
                      </div>
                    </div>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${metric.color}`}
                      initial={{ y: '100%' }}
                      whileInView={{ y: '0%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Simple Process
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-accent-500 mb-6">How Wellnest Works</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Your journey to better health and wellness in three simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                number: "1",
                title: "Create Your Profile",
                description: "Sign up and tell us about your health goals, preferences, and current wellness status."
              },
              {
                number: "2",
                title: "Customize Your Dashboard",
                description: "Build your personalized wellness dashboard with the features and tracking tools you need."
              },
              {
                number: "3",
                title: "Track & Improve",
                description: "Monitor your progress, receive personalized recommendations, and achieve your wellness goals."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center group"
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative overflow-hidden"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                  <span className="text-3xl font-bold text-primary-600 relative z-10">{step.number}</span>
                </motion.div>
                <h3 className="text-2xl font-semibold text-accent-500 mb-4">{step.title}</h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
                {index < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-primary-200 transform translate-x-1/2"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 bg-gradient-to-br from-accent-50 to-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Success Stories
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-accent-500 mb-6">Your Achievements</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Celebrate your wellness milestones and track your progress over time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Daily Streaks",
                value: 28,
                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                color: "from-orange-400 to-pink-500",
                suffix: "days"
              },
              {
                title: "Workouts Completed",
                value: 156,
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                color: "from-blue-400 to-indigo-500",
                suffix: "total"
              },
              {
                title: "Wellness Points",
                value: 2750,
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                color: "from-green-400 to-emerald-500",
                suffix: "pts"
              }
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-white rounded-2xl shadow-soft transform group-hover:scale-105 transition-transform duration-300"
                  whileHover={{ y: -5 }}
                />
                <div className="relative p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={achievement.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-accent-500 mb-2">{achievement.title}</h3>
                  <div className="text-4xl font-bold text-neutral-800 mb-2">
                    <AnimatedCounter value={achievement.value} />
                    <span className="text-lg text-neutral-500 ml-1">{achievement.suffix}</span>
                  </div>
                  <motion.div
                    className={`h-2 bg-gradient-to-r ${achievement.color} rounded-full mt-4`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Achievement Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="bg-white rounded-full p-6 shadow-soft aspect-square flex items-center justify-center group cursor-pointer"
              >
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <svg className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <span className="text-sm font-medium text-neutral-600">Achievement {index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-primary-100 text-sm font-medium mb-4 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              Join Today
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-12 leading-relaxed">
              Join thousands of users who are already improving their health and wellness with Wellnest.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-primary-700 bg-white hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Get Started Now
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Sign In
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;