"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Briefcase,
    GraduationCap,
    Building,
    MapPin,
    DollarSign,
    Mail,
    Search,
    TrendingUp,
    Users,
    Clock
} from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';
import usePayment from '@/hooks/usePayment';
import Script from 'next/script';
import isAlreadyPurchased from '@/action/isAlreadyPurchased';

export default function StartupJobsPage() {
    const [selectedAmount, setSelectedAmount] = useState(0);
    const basePrice = 149;
    const additionalAmounts = [50, 100, 150];
    const [isPurchased, setIsPurchased] = useState(false);
    const {
        isProcessing,
        paymentError,
        handlePayment,
    } = usePayment();

    useEffect(() => {
        const checkPurchase = async () => {
            const { success } = await isAlreadyPurchased("recently-funded-startup-list-of-india");
            setIsPurchased(success);
        }
        checkPurchase();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <div className="flex justify-center mb-6">
                            <GraduationCap className="w-16 h-16" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Land Your Dream Job at Funded Indian Startups
                        </h1>
                        <p className="text-xl mb-8 text-blue-100">
                            Access 300+ well-funded startups actively hiring fresh graduates and young professionals
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                <span>Recently Funded</span>
                            </div>
                            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                                <Users className="w-5 h-5 mr-2" />
                                <span>Actively Hiring</span>
                            </div>
                            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg">
                                <Clock className="w-5 h-5 mr-2" />
                                <span>Daily Updates</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* Value Proposition */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <Briefcase className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Direct Job Access</h3>
                                <p className="text-gray-600">Direct contact information for HR and career opportunities</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <Building className="w-8 h-8 text-purple-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Verified Startups</h3>
                                <p className="text-gray-600">All companies verified with recent funding rounds</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <DollarSign className="w-8 h-8 text-green-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Growth Potential</h3>
                                <p className="text-gray-600">Well-funded companies with competitive packages</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* What You Get Section */}
                    <Card className="mb-12">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold mb-6">What You Get</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: <Search className="w-5 h-5 text-blue-500" />,
                                        title: "Company Information",
                                        desc: "Detailed profiles of 300+ funded startups across India"
                                    },
                                    {
                                        icon: <Mail className="w-5 h-5 text-purple-500" />,
                                        title: "Direct Contact",
                                        desc: "Career emails and HR contact information"
                                    },
                                    {
                                        // icon: <Linkedin className="w-5 h-5 text-blue-600" />,
                                        icon: <SiLinkedin className="w-5 h-5 text-blue-600" />,
                                        desc: "Direct links to company LinkedIn profiles and career pages"
                                    },
                                    {
                                        icon: <MapPin className="w-5 h-5 text-red-500" />,
                                        title: "Location Data",
                                        desc: "Office locations across major Indian cities"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <p className="text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Card */}
                    <Card className="border-2 border-blue-200 shadow-xl mb-12">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Access Job Opportunities</h2>
                                <p className="text-gray-600">One-time payment for complete database access</p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600">
                                        ₹{basePrice + selectedAmount}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Student-friendly pricing</p>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm text-center mb-4">Support our mission with additional contribution:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <button
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                                            ${selectedAmount === 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            onClick={() => setSelectedAmount(0)}
                                        >
                                            Base (₹149)
                                        </button>
                                        {additionalAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                                                ${selectedAmount === amount ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                onClick={() => setSelectedAmount(amount)}
                                            >
                                                +₹{amount}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl"
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (isProcessing) return;
                                    if (isPurchased) window.location.href = "/my-purchase/recently-funded-startup-list-of-india";
                                    handlePayment("recently-funded-startup-list-of-india",
                                        basePrice + selectedAmount);
                                }}>
                                {isProcessing ? "Processing..." : isPurchased ? "Purchased" : "Buy Now"}
                            </Button>
                            {paymentError && <div className="text-red-500 text-sm mt-4">{paymentError}</div>}


                            <div className="mt-6 text-sm text-gray-500 text-center">
                                Secure payment powered by Razorpay
                            </div>
                        </CardContent>
                    </Card>

                    {/* Testimonials */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                quote: "Found my first job at a Series A startup through this database. The direct HR contacts made all the difference!",
                                author: "Priya S.",
                                role: "Software Engineer"
                            },
                            {
                                quote: "As a fresh graduate, this helped me discover so many startups I didn't even know were hiring. Worth every rupee!",
                                author: "Rahul M.",
                                role: "Business Analyst"
                            }
                        ].map((testimonial, index) => (
                            <Card key={index} className="bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-semibold text-gray-800">{testimonial.author}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </>
    );
}