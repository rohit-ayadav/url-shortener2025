
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'


const Feature = () => {
    const router = useRouter();
    return (
        < section className="py-20 bg-gray-50" >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">More Ways to Shorten</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Bulk Shortening</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Shorten multiple URLs at once by pasting them line by line
                            </p>
                            <Button variant="outline" className="w-full" onClick={() => router.push('/bulk-shortener')}>
                                Try Bulk Mode
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Text Mode</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Automatically detect and shorten URLs within your text
                            </p>
                            <Button variant="outline" className="w-full"
                                onClick={() => router.push('/text-mode')}>
                                Try Text Mode
                            </Button>

                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>API Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Integrate URL shortening directly into your applications
                            </p>
                            <Button variant="outline" className="w-full"
                                onClick={() => router.push('/api-docs')}>
                                View API Docs
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section >
    )
}

export default Feature
