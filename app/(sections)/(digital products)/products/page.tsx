"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Star, ShoppingCart, Strikethrough } from 'lucide-react';

const products = [
    {
        id: 'recently-funded-startup-list-of-india',
        name: "Recently Funded Startups List of India",
        description: "Access to 3500+ funded startups with direct HR contacts",
        price: "₹299 ₹149",
        category: "Database",
        rating: 4.8,
        sales: 1200,
        image: "/recently-funded-startups-in-india.webp",
        badge: "Most Popular"
    },
    // {
    //     id: 2,
    //     name: "Tech Startups Bundle",
    //     description: "Curated list of funded tech startups across India",
    //     price: 199,
    //     category: "Database",
    //     rating: 4.6,
    //     sales: 850,
    //     image: "/api/placeholder/300/200"
    // },
    // {
    //     id: 3,
    //     name: "Resume Templates",
    //     description: "ATS-friendly templates optimized for startup applications",
    //     price: 99,
    //     category: "Templates",
    //     rating: 4.7,
    //     sales: 2000,
    //     image: "/api/placeholder/300/200",
    //     badge: "Best Seller"
    // },
    // {
    //     id: 4,
    //     name: "Interview Prep Guide",
    //     description: "Comprehensive guide for startup interviews",
    //     price: 79,
    //     category: "Guides",
    //     rating: 4.5,
    //     sales: 1500,
    //     image: "/api/placeholder/300/200"
    // },
    // Add more products as needed
];

export default function ProductListingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');

    const categories = ['All', 'Templates', 'Guides'];

    const filteredProducts = products
        .filter(product =>
            (selectedCategory === 'All' || product.category === selectedCategory) &&
            (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.price.split(' ')[1]) - parseFloat(b.price.split(' ')[1]);
                case 'price-high':
                    return parseFloat(b.price.split(' ')[1]) - parseFloat(a.price.split(' ')[1]);
                case 'rating':
                    return b.rating - a.rating;
                default: // 'popular'
                    return b.sales - a.sales;
            }
        });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2">
                            {categories.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(category)}
                                    className="whitespace-nowrap"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Product Image */}
                            <div className="relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                {product.badge && (
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                        {product.badge}
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-4">
                                {/* Product Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm">{product.description}</p>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                                    </div>
                                    <span className="mx-2 text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">{product.sales} sold</span>
                                </div>

                                {/* Price and Action */}
                                <div className="flex items-center justify-between">
                                    <div className="text-xl font-bold">
                                        <span className="line-through">{product.price.split(' ')[0]}</span> {product.price.split(' ')[1]}
                                    </div>
                                    <Button className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => {
                                            window.location.href = `/products/${product.id}`;
                                        }}
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        See Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}