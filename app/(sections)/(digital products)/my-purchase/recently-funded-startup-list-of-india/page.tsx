"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, ExternalLink, MapPin, Building, DollarSign, MailIcon, Search } from 'lucide-react';
import Loading from '@/lib/Loading';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRound, setSelectedRound] = useState('all');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/my-purchase/recently-funded-startup-list-of-india');
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
            setStartups(data.data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (status === 'authenticated') fetchProducts();
    }, [status]);

    // Security measures
    useEffect(() => {
        const preventActions = (e: Event) => e.preventDefault();
        document.addEventListener('contextmenu', preventActions);
        document.addEventListener('selectstart', preventActions);
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && 'cCpPsS'.includes(e.key)) e.preventDefault();
        });

        return () => {
            document.removeEventListener('contextmenu', preventActions);
            document.removeEventListener('selectstart', preventActions);
        };
    }, []);

    const filteredStartups = startups.filter(startup => {
        const matchesSearch = startup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            startup.headquarters?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRound = selectedRound === 'all' || startup.round === selectedRound;
        return matchesSearch && matchesRound;
    });

    if (status === 'loading' || loading) return <Loading text="Loading Startup Data..." />;

    if (status === 'unauthenticated') {
        return (
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                <Alert variant="destructive">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>Please sign in to access this content.</AlertDescription>
                </Alert>
            </div>
        );
    }

    const Watermark = () => (
        <div className="fixed inset-0 pointer-events-none select-none z-50 overflow-hidden">
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="absolute text-gray-900 opacity-[0.158] transform rotate-[-30deg] text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `slide ${20 + i * 2}s linear infinite`
                    }}
                >
                    {session?.user?.name} • {session?.user?.email}
                    <br />
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Watermark />

            <main className="relative max-w-7xl mx-auto px-4 py-4 sm:py-8 md:px-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Startup Funding Database
                    </h1>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 sm:p-6 rounded-xl border border-yellow-200 shadow-lg">
                        <div className="flex items-center gap-3 text-amber-800 mb-3">
                            <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="font-semibold text-lg sm:text-xl">Secure Access Portal</span>
                        </div>
                        <p className="text-amber-700 text-sm sm:text-base">
                            Confidential information - Unauthorized sharing strictly prohibited.
                        </p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search startups..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="w-full sm:w-48 py-2 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                        value={selectedRound}
                        onChange={(e) => setSelectedRound(e.target.value)}
                    >
                        <option value="all">All Rounds</option>
                        {Array.from(new Set(startups.map(s => s.round))).map(round => (
                            <option key={round} value={round}>{round}</option>
                        ))}
                    </select>
                </div>

                {/* Error Handling */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Startup Cards */}
                <div className="space-y-4 mb-12">
                    {filteredStartups.map((startup, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-200 bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <span className="text-xl sm:text-2xl font-bold text-gray-400 font-mono">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div className="space-y-2 flex-grow">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <a
                                                    href={startup.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-lg sm:text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    {startup.name}
                                                </a>
                                                <a
                                                    href={startup.linkedin}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm flex-wrap">
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
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

                {/* Funding Guide */}
                <section className="mt-12 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Funding Series Guide</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fundingSeriesInfo.map((series, index) => (
                            <Card key={index} className="bg-white/90">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-2">{series.name}</h3>
                                    <p className="text-gray-600 text-sm">{series.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-12 py-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Access Info</h4>
                            <p className="text-blue-700 text-sm">
                                User: {session?.user?.email}
                                <br />
                                Date: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Usage Policy</h4>
                            <p className="text-purple-700 text-sm">Internal use only. No distribution.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Stats</h4>
                            <p className="text-green-700 text-sm">
                                Updated: {new Date().toLocaleDateString()}
                                <br />
                                Companies: {startups.length}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500">
                        © {new Date().getFullYear()} RUShort • All rights reserved
                    </div>
                </footer>
            </main>
        </div>
    );
}

const fundingSeriesInfo = [
    { name: 'Seed', description: 'Initial funding to develop idea/MVP, typically $10K-$2M' },
    { name: 'Pre-Series A', description: 'Bridge between seed and Series A, for early market traction' },
    { name: 'Series A', description: 'First significant round, product-market fit, $2M-$15M' },
    { name: 'Series B', description: 'Scaling business operations, $7M-$30M' },
    { name: 'Series C', description: 'Rapid expansion, new markets, $30M-$100M' },
    { name: 'Series D', description: 'Accelerating growth, pre-IPO preparation, $100M-$250M' },
    { name: 'Series E', description: 'Additional expansion, delayed IPO, or special situations' },
    { name: 'Series F', description: 'Later-stage funding, often pre-IPO or major expansion' },
    { name: 'Venture Debt', description: 'Loan financing alongside equity rounds, lower dilution' },
    { name: 'Bridge Round', description: 'Short-term funding between major rounds' },
    { name: 'Crossover', description: 'Mix of private/public investors, late-stage pre-IPO' }
];