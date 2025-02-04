"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Lock, ExternalLink, MapPin, Building, DollarSign, MailIcon } from 'lucide-react';
import startupData from '@/app/api/products/startupList1.json';

interface Startup {
    name?: string;
    amount?: string;
    round?: string;
    headquarters?: string;
    linkedin?: string;
    website?: string;
    careerEmail?: string;
}

export default function SecureStartupPage() {
    const { data: session, status } = useSession();
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && 'cCpPsS'.includes(e.key)) e.preventDefault();
        };
        const handleSelection = (e: Event) => e.preventDefault();

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelection);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelection);
        };
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            setStartups(startupData.Sheet1.map(startup => ({
                ...startup,
                amount: (startup.amount ?? '').toString(),
            })));
            setLoading(false);
        }
    }, [status]);

    if (status === 'loading' || loading) {
        return (
            <div className="p-8 space-y-4 max-w-7xl mx-auto">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <Alert variant="destructive">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>Please sign in to access this content.</AlertDescription>
                </Alert>
            </div>
        );
    }

    // Dynamic Watermark Component
    const Watermark = () => {
        return (
            <div className="fixed inset-0 pointer-events-none select-none z-50 overflow-hidden">
                {[...Array(10)].map((_, i) => {
                    const top = Math.random() * 100; // Random top position
                    const left = Math.random() * 100; // Random left position
    
                    return (
                        <div
                            key={i}
                            className="absolute text-gray-900 opacity-[0.258] transform rotate-[-30deg] text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap"
                            style={{
                                top: `${top}%`,
                                left: `${left}%`,
                                animation: `slide ${20 + i * 2}s linear infinite`
                            }}
                        >
                            {session?.user?.name} • {session?.user?.email}
                            <br />
                            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                        </div>
                    );
                })} 
            </div>
        );
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Watermark />

            <main className="relative max-w-7xl mx-auto px-4 py-8 md:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Startup Funding Database
                    </h1>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-lg">
                        <div className="flex items-center gap-3 text-amber-800 mb-3">
                            <Lock className="h-6 w-6" />
                            <span className="font-semibold text-xl">Secure Access Portal</span>
                        </div>
                        <p className="text-amber-700">
                            Confidential information - Unauthorized sharing strictly prohibited. Access logged and monitored.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="space-y-4 mb-12">
                    {startups.map((startup, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-200 bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <span className="text-2xl font-bold text-gray-400 font-mono">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div className="space-y-1 flex-grow">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={startup.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    {startup.name}
                                                </a>
                                                <a
                                                    href={startup.linkedin}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium text-green-700">{startup.amount}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Building className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-blue-700">{startup?.round || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-red-600" />
                                            <span className="text-gray-600">{startup.headquarters}</span>
                                        </div>
                                        <a
                                            href={`mailto:${startup.careerEmail}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                                        >
                                            <MailIcon className="h-4 w-4" />
                                            <span className="text-sm font-medium">Contact</span>
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-auto py-8 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Access Information</h4>
                            <p className="text-blue-700">
                                Logged in as: {session?.user?.email}<br />
                                Access Date: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Data Usage Policy</h4>
                            <p className="text-purple-700">
                                Internal use only. Distribution prohibited.
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Database Stats</h4>
                            <p className="text-green-700">
                                Last Updated: {new Date().toLocaleDateString()}<br />
                                Total Companies: {startups.length}
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} RUShort (a subsidiary of Resources and Updates) • All rights reserved
                    </div>
                </footer>
            </main>
        </div>
    );
}