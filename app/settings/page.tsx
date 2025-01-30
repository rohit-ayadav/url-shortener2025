'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Shield, CreditCard, Key, Upload, Eye, EyeOff, Copy,
    RefreshCw, CheckCircle2, AlertCircle, Loader2, QrCode
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface PaymentHistory {
    id: string;
    date: string;
    amount: number;
    status: 'succeeded' | 'failed' | 'pending';
    description: string;
}

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    subscription: {
        plan: 'free' | 'premium' | 'custom';
        expiryDate: string;
        status: 'active' | 'cancelled' | 'expired';
    };
    twoFactorEnabled: boolean;
    apiKey?: string;
    apiUsage: {
        total: number;
        limit: number;
    };
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/placeholder-avatar.jpg',
        subscription: {
            plan: 'free',
            expiryDate: '2024-12-31',
            status: 'active'
        },
        twoFactorEnabled: false,
        apiKey: 'sk_test_123456789',
        apiUsage: {
            total: 1234,
            limit: 10000
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [payments, setPayments] = useState<PaymentHistory[]>([
        {
            id: '1',
            date: '2024-01-15',
            amount: 29.99,
            status: 'succeeded',
            description: 'Premium Plan - Monthly'
        },
        {
            id: '2',
            date: '2023-12-15',
            amount: 29.99,
            status: 'succeeded',
            description: 'Premium Plan - Monthly'
        }
    ]);

    // Password change state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const { toast } = useToast();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile(prev => ({
                    ...prev,
                    avatar: e.target?.result as string
                }));
                toast({
                    title: "Success",
                    description: "Profile picture updated successfully",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            });
            return;
        }

        setIsChangingPassword(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast({
                title: "Success",
                description: "Password updated successfully",
            });
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update password",
                variant: "destructive",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleEnable2FA = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowQrCode(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setProfile(prev => ({
                ...prev,
                twoFactorEnabled: true
            }));
            setShowQrCode(false);
            toast({
                title: "Success",
                description: "Two-factor authentication enabled successfully",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const regenerateApiKey = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setProfile(prev => ({
                ...prev,
                apiKey: `sk_test_${Math.random().toString(36).substr(2, 9)}`
            }));
            toast({
                title: "Success",
                description: "API key regenerated successfully",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameUpdate = async (newName: string) => {
        setProfile(prev => ({
            ...prev,
            name: newName
        }));
        toast({
            title: "Success",
            description: "Name updated successfully",
        });
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Billing
                    </TabsTrigger>
                    <TabsTrigger value="api" className="flex items-center gap-2">
                        <Key className="w-4 h-4" /> API
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Manage your profile information and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={profile.avatar} />
                                    <AvatarFallback>
                                        <User className="w-16 h-16" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Change Picture
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={(e) => handleNameUpdate(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm(prev => ({
                                            ...prev,
                                            currentPassword: e.target.value
                                        }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm(prev => ({
                                            ...prev,
                                            newPassword: e.target.value
                                        }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handlePasswordChange}
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword && (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    )}
                                    Change Password
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Two-Factor Authentication</CardTitle>
                                <CardDescription>
                                    Add an extra layer of security to your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!profile.twoFactorEnabled ? (
                                    <div>
                                        {!showQrCode ? (
                                            <Button onClick={handleEnable2FA} disabled={isLoading}>
                                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                Enable 2FA
                                            </Button>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                                                    <QrCode className="w-32 h-32" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="verification-code">Enter Verification Code</Label>
                                                    <Input
                                                        id="verification-code"
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value)}
                                                        maxLength={6}
                                                    />
                                                </div>
                                                <Button onClick={handleVerify2FA} disabled={isLoading}>
                                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                    Verify
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span>Two-factor authentication is enabled</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>
                                    Manage your subscription and billing details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium">{profile.subscription.plan.charAt(0).toUpperCase() + profile.subscription.plan.slice(1)} Plan</h3>
                                        <p className="text-sm text-gray-500">
                                            Expires: {new Date(profile.subscription.expiryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant={
                                        profile.subscription.status === 'active' ? 'default' :
                                            profile.subscription.status === 'cancelled' ? 'destructive' : 'secondary'
                                    }>
                                        {profile.subscription.status.charAt(0).toUpperCase() + profile.subscription.status.slice(1)}
                                    </Badge>
                                </div>
                                {profile.subscription.plan !== 'premium' && (
                                    <Button className="w-full">
                                        Upgrade to Premium
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment History</CardTitle>
                                <CardDescription>
                                    View your recent payments and transactions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{payment.description}</TableCell>
                                                <TableCell>${payment.amount}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        payment.status === 'succeeded' ? 'default' :
                                                            payment.status === 'failed' ? 'destructive' : 'secondary'
                                                    }>
                                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* API Tab */}
                <TabsContent value="api">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>API Key</CardTitle>
                                <CardDescription>
                                    Manage your API key for programmatic access
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="api-key">API Key</Label>
                                    <Input
                                        id="api-key"
                                        value={profile.apiKey}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                                <Button onClick={regenerateApiKey} disabled
                                    ={isLoading}>
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Regenerate API Key
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>API Usage</CardTitle>
                                <CardDescription>
                                    View your API usage and limits
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Total Requests</TableHead>
                                            <TableHead>Limit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{profile.apiUsage.total}</TableCell>
                                            <TableCell>{profile.apiUsage.limit}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
