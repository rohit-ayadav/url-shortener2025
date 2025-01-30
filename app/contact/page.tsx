'use client';

import React, { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    Loader2,
    Twitter,
    Github,
    Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

const contactCategories = [
    { value: 'payment', label: 'Payment Related' },
    { value: 'url-shortener', label: 'URL Shortener Related' },
    { value: 'custom-pricing', label: 'Custom Pricing' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feature-request', label: 'Feature Request' },
    { value: 'partnership', label: 'Partnership Inquiry' },
    { value: 'other', label: 'Other' }
];

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            category: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Add your form submission logic here
            console.log('Form submitted:', formData);

            setSubmitStatus({
                type: 'success',
                message: 'Thank you for your message. We will get back to you soon!'
            });
            setFormData({
                name: '',
                email: '',
                category: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'An error occurred. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const MapComponent = () => (
        <div className="w-full h-[300px] rounded-lg overflow-hidden">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1867.106099062251!2d81.07143423770033!3d26.894452403438503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1shi!2sin!4v1738213901357!5m2!1shi!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1867.106099062251!2d81.07143423770033!3d26.894452403438503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1shi!2sin!4v1738213901357!5m2!1shi!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
            </iframe> */}
        </div>
    );

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            content: 'support@urlshortener.com',
            link: 'mailto:support@urlshortener.com'
        },
        {
            icon: Phone,
            title: 'Phone',
            content: '+1 (555) 123-4567',
            link: 'tel:+15551234567'
        },
        {
            icon: MapPin,
            title: 'Office',
            content: 'Times Square, New York, NY 10036',
            link: 'https://maps.google.com'
        }
    ];

    const socialLinks = [
        {
            icon: Twitter,
            name: 'Twitter',
            link: 'https://twitter.com'
        },
        {
            icon: Github,
            name: 'GitHub',
            link: 'https://github.com'
        },
        {
            icon: Linkedin,
            name: 'LinkedIn',
            link: 'https://linkedin.com'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Have questions about our URL shortener? We're here to help. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((item, index) => (
                            <Card key={index}>
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <item.icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <a
                                            href={item.link}
                                            className="text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            {item.content}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Map */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Our Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MapComponent />
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Follow Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                        >
                                            <social.icon className="h-5 w-5" />
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Send us a Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={handleCategoryChange}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contactCategories.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Your message..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Status Messages */}
                            {submitStatus.type && (
                                <Alert
                                    variant={submitStatus.type === 'success' ? 'default' : 'destructive'}
                                    className="mt-6"
                                >
                                    <AlertTitle>
                                        {submitStatus.type === 'success' ? 'Success!' : 'Error'}
                                    </AlertTitle>
                                    <AlertDescription>
                                        {submitStatus.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;