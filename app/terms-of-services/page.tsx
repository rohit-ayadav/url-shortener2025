"use client";
import React, { useState } from 'react';
import { ChevronRight, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TermsOfService = () => {
    const [activeSection, setActiveSection] = useState<number | null>(null);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sections = [
        {
            title: "Introduction",
            content: (
                <>
                    <p className="mb-4">
                        Welcome to RUShort! These Terms of Service ("Terms") govern your use of our URL-shortening service ("Service").
                        By accessing or using RUShort, you agree to comply with these Terms. If you do not agree, please refrain from
                        using the Service.
                    </p>
                </>
            )
        },
        {
            title: "User Eligibility",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>You must be at least 18 years old or have legal consent to use this Service.</li>
                    <li>Registration is required for premium features.</li>
                    <li>RUShort reserves the right to suspend accounts for violations of these Terms.</li>
                </ul>
            )
        },
        {
            title: "Acceptable Use Policy",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>Users must not use RUShort to shorten URLs that link to illegal, harmful, misleading, or fraudulent content.</li>
                    <li>Spam, phishing, malware, or any malicious activities are strictly prohibited.</li>
                    <li>RUShort may remove or disable any URL that violates these guidelines.</li>
                </ul>
            )
        },
        {
            title: "Free vs. Premium Users",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>Free users can shorten up to 10 URLs per day.</li>
                    <li>Premium users enjoy benefits such as unlimited URL shortening, custom aliases, detailed analytics, and extended expiration periods.</li>
                    <li>Premium subscriptions require a valid payment method and are subject to auto-renewal unless canceled.</li>
                </ul>
            )
        },
        {
            title: "Account & Data Privacy",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>User data is stored securely and used in accordance with our Privacy Policy.</li>
                    <li>We may use third-party services for payments, analytics, and security purposes.</li>
                    <li>RUShort does not sell user data to third parties.</li>
                </ul>
            )
        },
        {
            title: "Payments & Refunds",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>Payments for premium subscriptions are non-refundable except in cases of billing errors.</li>
                    <li>Subscriptions auto-renew unless canceled before the next billing cycle.</li>
                    <li>RUShort reserves the right to modify pricing with prior notice.</li>
                </ul>
            )
        },
        {
            title: "URL Expiry & Deletion",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>Free user URLs may expire after a set duration, while premium user URLs may have extended expiration periods.</li>
                    <li>Expired URLs may be deleted permanently without notice.</li>
                </ul>
            )
        },
        {
            title: "Liability & Disclaimers",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>RUShort is not responsible for the content of shortened URLs.</li>
                    <li>We do not guarantee uninterrupted service and are not liable for data loss.</li>
                    <li>Use of the Service is at your own risk.</li>
                </ul>
            )
        },
        {
            title: "Changes to Terms",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>RUShort may update these Terms at any time. Users will be notified of significant changes.</li>
                    <li>Continued use of the Service after updates means acceptance of the revised Terms.</li>
                </ul>
            )
        },
        {
            title: "Contact Information",
            content: (
                <div className="space-y-4">
                    <p>For any questions regarding these Terms, please contact us at:</p>
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
                        <CardTitle className="text-3xl font-bold text-blue-900">Terms of Service</CardTitle>
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
                    By using RUShort, you acknowledge that you have read, understood, and agreed to these Terms.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;