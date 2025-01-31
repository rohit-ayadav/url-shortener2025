'use client';
import React from 'react';
import { User, Shield, CreditCard, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInformation } from './components/profile/ProfileInformation';
import { SecuritySettings } from './components/profile/SecuritySettings';
import { BillingSection } from './components/profile/BillingSection';
import { ApiSection } from './components/profile/ApiSection';
import useSettings from '@/hooks/useSettings';

export default function ProfilePage() {
    const {
        profile,
        isLoading,
        showApiKey,
        payments,
        passwordForm,
        isChangingPassword,
        setPasswordForm,
        showQrCode,
        setVerificationCode,
        verificationCode,
        handleImageUpload,
        handlePasswordChange,
        handleEnable2FA,
        handleVerify2FA,
        regenerateApiKey,
        handleNameUpdate,
    } = useSettings();
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

                <TabsContent value="profile">
                    <ProfileInformation
                        profile={profile}
                        onNameUpdate={handleNameUpdate}
                        onAvatarUpdate={handleImageUpload}
                    />
                </TabsContent>

                <TabsContent value="security">
                    <SecuritySettings
                        profile={profile}
                        isLoading={isLoading}
                        isChangingPassword={isChangingPassword}
                        showQrCode={showQrCode}
                        verificationCode={verificationCode}
                        passwordForm={passwordForm}
                        onPasswordFormChange={(field, value) =>
                            setPasswordForm(prev => ({ ...prev, [field]: value }))}
                        onPasswordChange={handlePasswordChange}
                        onEnable2FA={handleEnable2FA}
                        onVerify2FA={handleVerify2FA}
                        onVerificationCodeChange={setVerificationCode}
                    />
                </TabsContent>

                <TabsContent value="billing">
                    <BillingSection
                        profile={profile}
                        payments={payments}
                    />
                </TabsContent>

                <TabsContent value="api">
                    <ApiSection
                        profile={profile}
                        isLoading={isLoading}
                        onRegenerateKey={regenerateApiKey}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}