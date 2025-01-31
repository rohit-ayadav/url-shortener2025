"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, BarChart3, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AboutPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Fast & Reliable",
            description: "Get instant link shortening with 99.9% uptime guarantee and lightning-fast redirects."
        },
        {
            icon: <Settings2 className="w-6 h-6" />,
            title: "Customizable Links",
            description: "Create branded short URLs that align with your identity and marketing needs."
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Analytics & Tracking",
            description: "Monitor click rates and engagement with comprehensive analytics dashboard."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Private",
            description: "Your data and links are protected with industry-standard security measures."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-blue-600 opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                                </pattern>
                            </defs>
                            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 animate-pulse" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">About RUShort</h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Empowering users with smart link management solutions since 2024
                        </p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Mission Section */}
                    <section className="text-center">
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-xl text-gray-600">
                            Our mission is to simplify link management and provide a fast, reliable, and secure
                            URL-shortening solution for everyone. We believe in enhancing digital connectivity
                            while ensuring privacy and security for all users.
                        </p>
                    </section>

                    {/* Features Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="mb-4 text-blue-600">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    {/* Key Features Section */}
                    <section className="bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-3xl font-bold mb-6 text-center">Key Features</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-full">
                                    <h3 className="text-xl font-semibold mb-2">Single Mode</h3>
                                    <p className="text-gray-600">Shorten individual URLs with custom aliases, prefixes, lengths, and expiry options.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-full">
                                    <h3 className="text-xl font-semibold mb-2">Batch Mode</h3>
                                    <p className="text-gray-600">Paste multiple URLs and shorten them in bulk with a single click.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-full">
                                    <h3 className="text-xl font-semibold mb-2">Text Mode</h3>
                                    <p className="text-gray-600">Extract and replace links within text while automatically shortening them.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="text-center bg-blue-600 text-white rounded-2xl p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-xl mb-8">Join thousands of users who trust RUShort for their link management needs.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200 text-lg px-8 group"
                                onClick={() => `${!loading && session ? router.push('/dashboard') : router.push('/signup')}`}
                            >
                                {!loading && session ? 'Go to Dashboard' : 'Sign Up Free'}
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant={'ghost'}
                                className="border-white text-white hover:bg-white/10 transition-all duration-200 text-lg px-8"
                                onClick={() => router.push('/contact')}
                            >
                                Contact Us
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AboutPage;