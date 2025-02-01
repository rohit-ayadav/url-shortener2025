"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import {
    Check,
    Crown,
    Loader2,
    HelpCircle,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';

interface PricingPlan {
    id: string;
    name: string;
    price: number | string;
    duration: string;
    features: Array<{
        name: string;
        tooltip: string;
    }>;
    popular?: boolean;
    buttonText: string;
    buttonVariant?: 'default' | 'outline';
}

const PricingPage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

    const { data: session, status } = useSession();

    const pricingPlans: PricingPlan[] = [
        {
            id: 'basic',
            name: 'Basic',
            price: 99,
            duration: 'month',
            buttonText: 'Get Started',
            buttonVariant: 'outline',
            features: [
                { name: 'Up to 1,000 links per month', tooltip: 'Reset monthly on your billing date' },
                { name: 'Basic analytics', tooltip: 'View clicks and basic geographic data' },
                { name: 'Random short URLs', tooltip: 'Automatically generated short URLs' },
                { name: 'Up yo 6 month link expiration', tooltip: 'Links automatically expire after 6 months' },
                { name: 'Basic API access', tooltip: 'Limited to 100 requests per day' },
            ]
        },
        {
            id: 'pro',
            name: 'Professional',
            price: 999,
            duration: 'month',
            popular: true,
            buttonText: 'Start Pro Trial',
            features: [
                { name: 'Unlimited links', tooltip: 'No monthly limits' },
                { name: 'Advanced analytics', tooltip: 'Detailed traffic insights and user behavior tracking' },
                { name: 'Custom domains', tooltip: 'Use your own domain for branded short links' },
                { name: 'Custom aliases', tooltip: 'Create memorable URLs with your own keywords' },
                { name: 'Bulk URL shortening', tooltip: 'Shorten multiple URLs at once' },
                { name: 'Team collaboration', tooltip: 'Add team members and manage permissions' },
                { name: 'Full API access', tooltip: 'Unlimited API requests with higher rate limits' },
                { name: 'Priority support', tooltip: '24/7 email and chat support' },
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 'Custom',
            duration: 'month',
            buttonText: 'Contact Sales',
            buttonVariant: 'outline',
            features: [
                { name: 'Everything in Pro', tooltip: 'All Pro features included' },
                { name: 'Dedicated account manager', tooltip: 'Personal support and strategic guidance' },
                { name: 'Custom integration support', tooltip: 'Help implementing RUShort in your workflow' },
                { name: 'SLA guarantee', tooltip: '99.99% uptime guarantee' },
                { name: 'Advanced security features', tooltip: 'SSO, 2FA, and custom security policies' },
                { name: 'Custom feature development', tooltip: 'Build features specific to your needs' },
            ]
        }
    ];

    const handlePayment = async (plan: PricingPlan) => {
        if (status === 'loading') {
            return;
        }
        if (status === 'unauthenticated') {
            window.location.href = "/auth";
            return;
        }

        if (plan.id === 'enterprise') {
            window.location.href = "/contact?subject=custum-pricing";
            return;
        }

        setSelectedPlan(plan);
        setIsProcessing(true);
        setPaymentError("");

        try {
            const body = {
                amount: plan.price,
                currency: "INR",
                paymentMethod: "razorpay",
            };
            console.log(`Creating order for ${plan.name} plan...:`, body);
            
            const res = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: "INR",
                    name: "RUShort",
                    description: `Payment for ${plan.name} Plan`,
                    image: "/favicon.ico",
                    order_id: data.orderid,
                    handler: async function (response: any) {
                        // Save the payment details and upgrade the user's plan
                        const paymentData = {
                            orderId: data.orderid,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            plan: plan.id,
                        };
                        const result = await fetch("/api/payments/verify-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(paymentData),
                        });
                        if (result.ok) {
                            // Payment successful
                            window.location.href = "/dashboard";
                        }
                        else {
                            setPaymentError("Failed to verify payment. Please try again later.");
                        }
                    },
                    prefill: {
                        name: "RUShort User",
                        email: "",
                        contact: "",
                    },
                    theme: {
                        color: "#2563EB",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                setPaymentError("Failed to create order. Please try again.");
            }
        } catch (error) {
            setPaymentError("An error occurred. Please try again later.");
        }

        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative py-20 bg-blue-600">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="relative z-10 container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-blue-100">
                            Choose the perfect plan for your link management needs. All plans include our core URL shortening features.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="container mx-auto px-4 -mt-16">
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                    <Badge className="bg-blue-500">Most Popular</Badge>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">{plan.name}</span>
                                        {plan.id === 'enterprise' && <Crown className="h-5 w-5 text-yellow-500" />}
                                    </div>
                                    <div className="mt-4">
                                        {typeof plan.price === 'number' ? (
                                            <>
                                                <span className="text-4xl font-bold">₹{plan.price}</span>
                                                <span className="text-gray-500 ml-2">/{plan.duration}</span>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold">{plan.price} Pricing</span>
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="mt-6 space-y-4">
                                    {plan.features.map((feature) => (
                                        <TooltipProvider key={feature.name}>
                                            <div className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                <span>{feature.name}</span>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 text-gray-400 shrink-0 mt-0.5 cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="w-64">{feature.tooltip}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TooltipProvider>
                                    ))}
                                </div>

                                <Button
                                    className={`w-full mt-8 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                    variant={plan.buttonVariant || 'default'}
                                    onClick={() => handlePayment(plan)}
                                    disabled={isProcessing && selectedPlan?.id === plan.id}
                                >
                                    {isProcessing && selectedPlan?.id === plan.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            {plan.buttonText}
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Error Message */}
                {paymentError && (
                    <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
                        <AlertTitle>Payment Error</AlertTitle>
                        <AlertDescription>{paymentError}</AlertDescription>
                    </Alert>
                )}

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">What happens when I reach my monthly link limit?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Your existing links will continue to work, but you won't be able to create new ones until your limit resets or you upgrade to a higher plan.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Can I upgrade or downgrade my plan at any time?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Yes! You can change your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-20 pb-20">
                    <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-gray-600 mb-8">Our team is here to help you find the perfect plan for your needs.</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline">View Documentation</Button>
                        <Button>Contact Support</Button>
                    </div>
                </div>
            </div>

            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
};

export default PricingPage;