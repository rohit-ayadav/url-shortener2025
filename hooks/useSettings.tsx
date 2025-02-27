"use client";
import React, { useEffect } from 'react'
import { useState } from 'react';
import { UserProfile, PaymentHistory } from '@/types/types';
import { useToast } from './use-toast';
import { useSession } from 'next-auth/react';
import { doUpdatePassword } from '@/action/doUpdatePassword';

const useSettings = () => {
    const { data: session, status } = useSession();
    const toast = useToast();
    const [profile, setProfile] = useState<UserProfile>({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        avatar: session?.user?.image || '',
        subscription: {
            plan: 'free',
            expiryDate: '',
            status: 'active',
        },
        twoFactorEnabled: false,
        apiKey: '********',
        apiUsage: {
            total: 100,
            limit: 1000,
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [payments, setPayments] = useState<PaymentHistory[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const email = session?.user?.email;
                console.log("\n\nEmail:", email);
                if (email) {
                    const response = await fetch('/api/accounts/getaccinfo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });
                    if (!response.ok) {
                        throw new Error("Failed to fetch profile data");
                    }
                    const { profileResponse, paymentsResponse } = await response.json();
                    setProfile(profileResponse);
                    setPayments(paymentsResponse);
                } else {
                    toast.toast({
                        title: "Error",
                        description: "User email is not available",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast.toast({
                    title: "Error",
                    description: "Failed to fetch profile data",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };
        if (status !== 'loading') fetchProfile();
    }, [session, status]);

    // Password change state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                toast.toast({
                    title: "Success",
                    description: "Profile picture updated successfully",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = async () => {

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            });
            return;
        }
        const email = session?.user?.email;
        if (!email) {
            toast.toast({
                title: "Error",
                description: "User email is not available",
                variant: "destructive",
            });
            return;
        }

        setIsChangingPassword(true);
        const { success, error } = await doUpdatePassword(passwordForm.currentPassword, passwordForm.newPassword, email);
        console.log(`\n\nSuccess: ${success}\nError: ${error}\n\n`);
        toast.toast({
            title: `${success ? "Password Updated Successfully" : "Error"}`,
            description: `${success ? success : error}`,
            variant: `${success ? "default" : "destructive"}`,
        });
        setIsChangingPassword(false);
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

            setShowQrCode(false);
            toast.toast({
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

            toast.toast({
                title: "Success",
                description: "API key regenerated successfully",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameUpdate = async (newName: string) => {

        toast.toast({
            title: "Success",
            description: "Name updated successfully",
        });
    };

    return {
        profile,
        isLoading,
        showApiKey,
        payments,
        passwordForm,
        setPasswordForm,
        isChangingPassword,
        showQrCode,
        setVerificationCode,
        verificationCode,
        handleImageUpload,
        handlePasswordChange,
        handleEnable2FA,
        handleVerify2FA,
        regenerateApiKey,
        handleNameUpdate,
    }

}

export default useSettings;
