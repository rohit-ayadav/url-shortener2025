"use client";
import React, { Suspense, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn, ArrowLeft, Github, Send, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from "react-icons/fa";
import useAuth from '@/hooks/useAuth';
import { signIn } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

const AuthPages = () => {
    const {
        isLogin,
        showPassword,
        setShowPassword,
        loading,
        error,
        success,
        formData,
        setFormData,
        handleSubmit,
        toggleView,
        redirect,
        setRedirect,
        handleSendOtp,
        showOtpInput,
        otpSending,
        handleGithubAuth,
    } = useAuth();

    const params = useSearchParams();
    useEffect(() => {
        if (params.has('signup')) {
            toggleView();
        }
        setRedirect(params.get('redirect') || null);
    }, [params]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-md w-full">
                <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-blue-900">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? 'Enter your credentials to access your account'
                                : 'Sign up to start shortening your URLs'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Social Auth Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={async () => await signIn('google', { callbackUrl: `/${redirect ? redirect : 'dashboard'}` })}
                                    variant="outline"
                                    type="button"
                                    className="w-full border-blue-200 hover:bg-blue-50"
                                >
                                    <span className="h-4 w-4 mr-2"><FaGoogle /></span>
                                    Google
                                </Button>
                                <Button
                                    onClick={handleGithubAuth}
                                    variant="outline"
                                    type="button"
                                    className="w-full border-blue-200 hover:bg-blue-50"
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                            </div>

                            <div className="relative">
                                <Separator />
                                <div className="absolute inset-x-0 -top-3 flex justify-center">
                                    <span className="bg-white px-2 text-sm text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Name Field (Signup only) */}
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="border-blue-100 focus:border-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                            )}

                            {/* Email Field with OTP Button */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="pl-10 border-blue-100 focus:border-blue-500"
                                            placeholder="you@example.com"
                                            required
                                            disabled={showOtpInput}
                                        />
                                    </div>
                                    {!isLogin && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-blue-200 hover:bg-blue-50 whitespace-nowrap"
                                            onClick={handleSendOtp}
                                            disabled={otpSending || showOtpInput}
                                        >
                                            {otpSending ? (
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                                                    Sending
                                                </div>
                                            ) : showOtpInput ? (
                                                <div className="flex items-center">
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Sent
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send OTP
                                                </div>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* OTP Input Field (Signup only) */}
                            {!isLogin && showOtpInput && (
                                <div className="space-y-2">
                                    <Label htmlFor="otp">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                        className="border-blue-100 focus:border-blue-500"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            )}

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-10 pr-10 border-blue-100 focus:border-blue-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Confirm Password (Signup only) */}
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="pl-10 border-blue-100 focus:border-blue-500"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Error Alert */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Success Alert */}
                            {success && (
                                <p className="text-green-600 text-center">{success}</p>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                disabled={loading || (!isLogin && !showOtpInput)}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        {isLogin ? 'Signing in...' : 'Creating account...'}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        {isLogin ? (
                                            <>
                                                <LogIn className="h-4 w-4 mr-2" />
                                                Sign In
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Create Account
                                            </>
                                        )}
                                    </div>
                                )}
                            </Button>

                            {/* Forgot Password (Login only) */}
                            {isLogin && (
                                <Button
                                    type="button"
                                    variant="link"
                                    className="w-full text-blue-600 hover:text-blue-700"
                                >
                                    Forgot your password?
                                </Button>
                            )}
                        </form>
                    </CardContent>

                    <CardFooter>
                        <p className="text-sm text-center w-full text-gray-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Button
                                type="button"
                                variant="link"
                                className="text-blue-600 hover:text-blue-700 p-0"
                                onClick={toggleView}
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </Button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div >
    );
};


const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-blue-600 font-medium">Loading...</span>
            </div>
        </div>
    );
}

const AuthPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <AuthPages />
        </Suspense>
    );
}

export default AuthPage;