import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'


const Pricing = () => {
    const router = useRouter();
    return (
        <div>
            {/* Pricing Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>Basic</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-4">₹99/mo</div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Basic link shortening
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> 1000 links/month
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Basic analytics
                                    </li>
                                </ul>
                                <Button className="w-full mt-6"
                                    onClick={() => router.push('/pricing')}
                                >
                                    Get Started
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow border-blue-500">
                            <CardHeader>
                                <CardTitle>Pro</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-4">₹999/mo</div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Everything in Free
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Unlimited links
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Advanced analytics
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Custom domains
                                    </li>
                                </ul>
                                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => router.push('/pricing')}
                                >
                                    Purchase Now
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>Enterprise</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-4">Custom</div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Everything in Pro
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Priority support
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> SLA guarantee
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Custom integration
                                    </li>
                                </ul>
                                <Button variant="outline" className="w-full mt-6">
                                    Contact Sales
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Pricing
