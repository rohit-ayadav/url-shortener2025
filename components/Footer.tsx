"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
    const router = useRouter();

    const footerSections = [
        {
            title: 'Product',
            links: [
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'API', href: '/settings?api' },
                { label: 'Documentation', href: '/api-docs' }
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About', href: '/about' },
                { label: 'Blog', href: 'https://blogging-one-omega.vercel.app/', external: true },
                { label: 'Careers', href: '/careers' },
                { label: 'Contact', href: '/contact' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-of-services' },
                { label: 'Cookie Policy', href: '/cookie-policy' }
            ]
        }
    ];

    const socialLinks = [
        { Icon: Github, href: 'https://github.com/rushort', label: 'GitHub' },
        { Icon: Twitter, href: 'https://twitter.com/rushort', label: 'Twitter' },
        { Icon: Linkedin, href: 'https://linkedin.com/company/rushort', label: 'LinkedIn' }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">RU</span>
                            </div>
                            <h3 className="text-white text-xl font-bold">RUShort</h3>
                        </div>
                        <p className="text-gray-400">Making links shorter, sharing easier.</p>

                        {/* Social Links */}
                        <div className="flex space-x-4 pt-4">
                            {socialLinks.map(({ Icon, href, label }) => (
                                <Button
                                    key={label}
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full hover:text-white hover:bg-gray-800"
                                    asChild
                                >
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="text-white font-bold">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        {link.external ? (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                                            >
                                                {link.label}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-gray-400 hover:text-white transition-colors duration-200"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <p>© {new Date().getFullYear()} RUShort. All rights reserved.</p>
                        <div className="flex gap-8">
                            <Button
                                variant="link"
                                className="text-gray-400 hover:text-white p-0 h-auto"
                                asChild
                            >
                                <Link href="/terms-of-service">Terms</Link>
                            </Button>
                            <Button
                                variant="link"
                                className="text-gray-400 hover:text-white p-0 h-auto"
                                asChild
                            >
                                <Link href="/privacy-policy">Privacy</Link>
                            </Button>
                            <Button
                                variant="link"
                                className="text-gray-400 hover:text-white p-0 h-auto"
                                asChild
                            >
                                <Link href="/cookie-policy">Cookies</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;