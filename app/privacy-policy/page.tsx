"use client";
import React, { useState } from 'react';
import { Shield, Mail, AlertCircle, ChevronRight, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState<number | null>(null);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sections = [
        {
            title: "Introduction",
            content: (
                <p className="text-gray-700">
                    Welcome to RUShort! This Privacy Policy outlines how we collect, use, and protect your information
                    when you use our URL-shortening service ("Service"). By accessing or using RUShort, you agree to
                    this policy.
                </p>
            )
        },
        {
            title: "Information We Collect",
            content: (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-blue-900">Personal Information</h3>
                        <p className="text-gray-700">
                            When you register for an account, we collect your name, email address, and payment details
                            (for premium users).
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-blue-900">Usage Data</h3>
                        <p className="text-gray-700">
                            We collect logs of shortened URLs, IP addresses, browser type, and device information for
                            analytics and security purposes.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-blue-900">Cookies and Tracking</h3>
                        <p className="text-gray-700">
                            We use cookies to enhance user experience, track usage patterns, and manage authentication
                            sessions.
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "How We Use Your Information",
            content: (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>To provide and improve the Service.</li>
                    <li>To track usage analytics and prevent abuse.</li>
                    <li>To communicate important updates, security alerts, and promotional offers.</li>
                    <li>To process payments for premium subscriptions.</li>
                </ul>
            )
        },
        {
            title: "Data Sharing and Third-Party Services",
            content: (
                <div className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <AlertDescription className="text-blue-700">
                            We do <strong>not</strong> sell your personal data to third parties.
                        </AlertDescription>
                    </Alert>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>We may share data with third-party payment processors, analytics providers, and security services to maintain and improve the Service.</li>
                        <li>Law enforcement agencies may be granted access to user data if required by law.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Data Security",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-900">
                        <Shield className="h-5 w-5" />
                        <p className="font-semibold">Security Measures</p>
                    </div>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>We implement industry-standard security measures to protect your data.</li>
                        <li>Despite our best efforts, no online service can guarantee absolute security.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "User Rights & Choices",
            content: (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>You may request access, modification, or deletion of your personal data.</li>
                    <li>You can opt-out of promotional emails by following the unsubscribe link.</li>
                    <li>Cookie preferences can be managed via browser settings.</li>
                </ul>
            )
        },
        {
            title: "Data Retention",
            content: (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Free user URLs and related data may be deleted after a certain period.</li>
                    <li>Premium user data is retained as long as the subscription remains active.</li>
                    <li>Logs and analytics data are stored for security and operational purposes.</li>
                </ul>
            )
        },
        {
            title: "Changes to This Policy",
            content: (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>We may update this Privacy Policy periodically. Users will be notified of significant changes.</li>
                    <li>Continued use of the Service after updates signifies acceptance of the revised policy.</li>
                </ul>
            )
        },
        {
            title: "Contact Information",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-700">For any privacy-related inquiries, please contact us at:</p>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.location.href = 'mailto:rohitkuyada@gmail.com'}
                    >
                        <Mail className="h-4 w-4" />
                        rohitkuyada@gmail.com
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-blue-600" />
                            <CardTitle className="text-3xl font-bold text-blue-900">Privacy Policy</CardTitle>
                        </div>
                        <CardDescription className="text-blue-600">
                            Last updated: January 30, 2025
                        </CardDescription>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {sections.map((section, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm"
                                    onClick={() => {
                                        setActiveSection(index);
                                        document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {section.title}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                id={`section-${index}`}
                                className={`py-6 scroll-mt-24 ${activeSection === index ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <ChevronRight className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-blue-900">{section.title}</h2>
                                </div>
                                <div className="prose prose-blue max-w-none pl-7">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="fixed bottom-8 right-8">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-lg"
                        onClick={scrollToTop}
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    By using RUShort, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;