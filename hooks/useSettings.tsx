import React from 'react'
import { useState } from 'react';
import { UserProfile, PaymentHistory } from '@/types/types';
import { useToast } from './use-toast';

const useSettings = () => {
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
