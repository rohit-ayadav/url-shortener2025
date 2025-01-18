import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-12 border-t bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">RUshort</h3>
                        <p className="text-sm text-gray-600">
                            A modern URL shortener built with performance and simplicity in mind.
                            Create short, memorable links in seconds.
                        </p>
                        <p className="text-sm text-gray-600">
                            This service is provided by<a href='https://resourcesandcarrier.online/' className="text-blue-600 hover:underline"> Resources and Updates.</a>
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/my-url" className="text-sm text-gray-600 hover:text-blue-600">
                                    My URLs
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/api-docs" className="text-sm text-gray-600 hover:text-blue-600">
                                    API Documentation
                                </a>
                            </li>
                            <li>
                                <a href="/faq" className="text-sm text-gray-600 hover:text-blue-600">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Contact */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="hover:text-blue-600"
                            >
                                <a
                                    href="https://github.com/rohit-ayadav/url-shortener2025"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                >
                                    <Github className="h-5 w-5" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="hover:text-blue-600"
                            >
                                <a
                                    href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Contact us at{' '}
                            <a
                                href="mailto:resourcesandupdates@gmail.com"
                                className="text-blue-600 hover:underline"
                            >
                                support@rushort.site
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600">
                            © {currentYear} RUshort. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            Made with <Heart className="h-4 w-4 text-red-500" /> by{' '}
                            <a
                                href="https://github.com/rohit-ayadav/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Rohit Kumar Yadav
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;