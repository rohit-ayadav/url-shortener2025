// my-purchase/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Package,
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock
} from 'lucide-react';
import Loading from '@/lib/Loading';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    visibility: string;
    date?: string;
    status?: string;
}

const MyPurchasePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const toast = useToast();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/my-purchase');
            console.log(res);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to fetch products');
            }

            setProducts(data.purchasedProducts);
            console.log("Products:", data.purchasedProducts);
            console.log("PProduct after setProducts:", products);

            toast.toast({
                title: 'Products fetched successfully',
                description: 'Your purchases have been fetched successfully',
                variant: 'default'
            })
        } catch (error) {
            setError(error as Error);
            // toast.toast({
            //     title: 'Error fetching products',
            //     description: 'An error occurred while fetching your purchases',
            //     variant: 'destructive'
            // });
            // console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Loading text="Please wait while we fetch your purchases" />
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {error.message || 'Error Fetching Purchases'}
                        </h3>
                        <p className="text-gray-500">
                            You haven't made any purchases yet. Check out our <a href="/products" className="text-blue-600 hover:underline">products</a> to get started!
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!products || !products.length) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Purchases Yet
                        </h3>
                        <p className="text-gray-500">
                            You haven't made any purchases yet.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        const statusColors = {
            active: 'text-green-600 bg-green-50',
            pending: 'text-yellow-600 bg-yellow-50',
            expired: 'text-red-600 bg-red-50',
            default: 'text-gray-600 bg-gray-50'
        };
        return statusColors[status.toLowerCase() as keyof typeof statusColors] || statusColors.default;
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Purchases</h1>

            <div className="space-y-4">
                {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Link href={`/my-purchase/${product.id}`}>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 mb-4">{product.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Purchased: {
                                                    product.date
                                                        ? new Date(product.date).toLocaleDateString()
                                                        : 'N/A'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Package className="h-4 w-4" />
                                            <span>ID: {product.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {product.currency} {product.price.toLocaleString()}
                                    </div>

                                    {product.status && (
                                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                                            {getStatusIcon(product.status)}
                                            <span>{product.status}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MyPurchasePage;