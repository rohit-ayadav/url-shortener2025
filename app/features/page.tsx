"use client";

import React from 'react';
import {
    Link as LucideLink,
    BarChart3,
    Globe2,
    Shield,
    Share2,
    Zap,
    Users,
    Clock,
    Code2,
    Fingerprint,
    Smartphone,
    FileText,
    ScrollText,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const FeaturesPage = () => {
    const router = useRouter();
    const { data, status } = useSession();
    const features = [
        {
            icon: LucideLink,
            title: "URL Shortening",
            description: "Transform long URLs into concise, shareable links with custom aliases and prefixes.",
            details: [
                "Custom aliases for branded links",
                "Configurable link length",
                "Optional custom prefixes",
                "Bulk URL shortening",
                "QR code generation"
            ]
        },
        {
            icon: BarChart3,
            title: "Advanced Analytics",
            description: "Gain valuable insights into your link performance with detailed analytics.",
            details: [
                "Real-time click tracking",
                "Geographic location data",
                "Device and browser analytics",
                "Referrer tracking",
                "Custom reporting periods"
            ]
        },
        {
            icon: Globe2,
            title: "Custom Domains",
            description: "Use your own domain for shortened links to maintain brand consistency.",
            details: [
                "Multiple domain support",
                "SSL certificate management",
                "Domain health monitoring",
                "Custom DNS settings",
                "Branded short links"
            ]
        },
        {
            icon: Shield,
            title: "Security Features",
            description: "Keep your links and data secure with advanced security features.",
            details: [
                "Password protection",
                "Link expiration dates",
                "HTTPS encryption",
                "Rate limiting",
                "Access controls"
            ]
        }
    ];

    const useCases = [
        {
            title: "Marketing Teams",
            description: "Track campaign performance and manage branded links for multiple channels.",
            benefits: [
                "Campaign tracking",
                "A/B testing",
                "Social media optimization",
                "ROI measurement"
            ]
        },
        {
            title: "Content Creators",
            description: "Share content easily across platforms with trackable, branded links.",
            benefits: [
                "Bio link management",
                "Content analytics",
                "Audience insights",
                "Cross-platform sharing"
            ]
        },
        {
            title: "Enterprise",
            description: "Scale your link management with enterprise-grade features and security.",
            benefits: [
                "Team collaboration",
                "API integration",
                "Custom solutions",
                "Dedicated support"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-blue-600 text-white">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="relative container mx-auto px-4 py-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Powerful Features for Modern Link Management
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Everything you need to create, manage, and track your shortened URLs in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                                onClick={() => `${status === 'authenticated' ? '/dashboard' : '/signup'}`}>
                                {status === 'authenticated' ? 'Go to Dashboard' : 'Sign Up Free'}
                            </Button>
                            <Link href='/pricing' className="w-full sm:w-auto">
                                <Button size="lg" variant="secondary" className="border-white/30 hover:bg-white/10 w-full sm:w-auto">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Features Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-blue-100">
                                        <feature.icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.details.map((detail) => (
                                        <li key={detail} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Additional Features */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Additional Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Zap, title: "Fast Performance", description: "Lightning-quick link creation and redirection" },
                            { icon: Users, title: "Team Collaboration", description: "Work together with role-based access" },
                            { icon: Clock, title: "Link Scheduling", description: "Schedule links to activate automatically" },
                            { icon: Code2, title: "API Access", description: "Full REST API for integration" },
                            { icon: Fingerprint, title: "Click Fraud Detection", description: "Identify and filter suspicious traffic" },
                            { icon: Smartphone, title: "Mobile Optimized", description: "Perfect experience on all devices" },
                            { icon: FileText, title: "Custom Templates", description: "Create reusable link templates" },
                            { icon: ScrollText, title: "Detailed Logs", description: "Complete activity logging" }
                        ].map((item) => (
                            <Card key={item.title} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                        <item.icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Use Cases */}
            <div className="container mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Perfect for Every Use Case</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {useCases.map((useCase) => (
                        <Card key={useCase.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{useCase.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">{useCase.description}</p>
                                <ul className="space-y-2">
                                    {useCase.benefits.map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 text-white">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of users who trust RUShort for their link management needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50"
                                onClick={() => {
                                    if (status !== 'loading' && status === 'authenticated' && data) {
                                        router.push('/dashboard');
                                    }
                                    else {
                                        router.push('/signup');
                                    }
                                }}>
                                {status === 'authenticated' ? 'Go to Dashboard' : 'Sign Up Free'
                                }
                            </Button>
                            <Button size="lg" variant="secondary" className="border-white/30 hover:bg-white/10"
                                onClick={() => router.push('/contact?subject=Sales Inquiry')}>
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FeaturesPage;