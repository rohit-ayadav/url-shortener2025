"use client";
import { signIn, useSession } from 'next-auth/react';
import AuthError from 'next-auth/react';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthFormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    otp: string;
}

const useAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        otp: ''
    });
    const [redirect, setRedirect] = useState<string | null>(null);
    const router = useRouter();
    const { data: session, status } = useSession();
    const toast = useToast();
    const [showOtpInput, setShowOtpInput] = React.useState(false);
    const [otpSending, setOtpSending] = React.useState(false);

    useEffect(() => {
        console.log('\nUseAuth\nSession:', session);
        console.log('Status:', status);
        if (session && status === 'authenticated') {
            toast.toast({
                title: 'You are already logged in',
                description: `Redirecting to ${redirect || 'dashboard'}...`,
                duration: 5000,
                variant: 'default',
            })
            router.push(`${redirect || 'dashboard'}`);
        }
    }, [session, status]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Call your authentication API here
            if (isLogin) {
                console.log(`Signing in with email: ${formData.email} and password: ${formData.password}`);
                try {
                    const result = await signIn('credentials', {
                        email: formData.email,
                        password: formData.password,
                        redirect: false,
                    });
                    console.log('Sign in result:', result);

                    if (result?.ok) {
                        toast.toast({
                            title: 'Sign in successful',
                            description: 'You have successfully signed in.',
                        });
                        setSuccess('Sign in successful');
                        if (result.ok) {
                            router.push(`/${redirect || 'dashboard'}`);
                        } else {
                            throw new Error(result.error || 'Authentication failed');
                        }
                    }
                    if (result?.error) {
                        const errorMessages: Record<string, string> = {
                            'CredentialsSignin': 'Invalid credentials',
                            'EmailVerification': 'Please verify your email address',
                        };
                        console.log('Error:', errorMessages[result.error] || result.error);
                        throw new Error(errorMessages[result.error] || result.error);
                    }
                } catch (error: any) {
                    throw error;
                }
            } else {
                // Register user
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        name: formData.name,
                        otp: formData.otp,
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Something went wrong');
                }
                toast.toast({
                    title: 'Account created',
                    description: 'Your account has been created successfully.',
                    variant: 'default',
                })
                setSuccess('Account created. Please sign in.');
                setIsLogin(true);
            }
        } catch (err: unknown) {
            // console.log(`Outer catch block: ${err}`);
            if (err instanceof Error) {
                setError(`${err.message}`);
            } else {
                setError('An unknown error occurred');
            }
            toast.toast({
                title: 'Error',
                description: `${err instanceof Error ? err.message : 'An unknown error occurred'}`,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleView = () => {
        setIsLogin(!isLogin);
        setError(null);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            otp: ''
        });
    };
    const handleSendOtp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
        e.preventDefault();
        if (!formData.email || !formData.name) {
            setError('Please enter your name and email');
            toast.toast({
                title: 'Email required',
                description: 'Please enter your email to receive OTP',
                variant: 'destructive',
            });
            return;
        }
        setError(null);
        setOtpSending(true);
        try {
            const response = await fetch('/api/auth/sendOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            setShowOtpInput(true);
            toast.toast({
                title: 'OTP sent',
                description: 'OTP has been sent to your email',
                variant: 'default',
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(`${err.message}`);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setOtpSending(false);
        }
    };

    return {
        isLogin,
        setIsLogin,
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
    };
}

export default useAuth;