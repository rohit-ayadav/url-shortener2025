"use client";
import { signIn } from 'next-auth/react';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getSessionAtHome } from '../../auth';

interface AuthFormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
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
    });
    const router = useRouter();

    // useEffect(() => {
    //     const fetchSession = async () => {
    //         const session = await getSessionAtHome();
    //         if (session) {
    //             router.push('/profile');
    //         }
    //     };
    //     fetchSession();
    // }, []);

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
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });
                if (result?.ok) {
                    toast.success('Sign in successful');
                    setSuccess('Sign in successful');
                    if (result.ok) {
                        router.push('/profile');
                    } else {
                        throw new Error(result.error || 'Authentication failed');
                    }
                }
                else {
                    throw new Error(result?.error || 'Authentication failed');
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
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Something went wrong');
                }
                toast.success('Account created. Please sign in.');
                setSuccess('Account created. Please sign in.');
                setIsLogin(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(`${err.message}`);
            } else {
                setError('An unknown error occurred');
            }
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
        });
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
    };
}

export default useAuth
