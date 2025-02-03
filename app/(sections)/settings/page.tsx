'use client';
import React, { useEffect, useState } from 'react';
import { User, Shield, CreditCard, Key, ChevronRight } from 'lucide-react';
import { ProfileInformation } from './components/profile/ProfileInformation';
import { SecuritySettings } from './components/profile/SecuritySettings';
import { BillingSection } from './components/profile/BillingSection';
import { ApiSection } from './components/profile/ApiSection';
import useSettings from '@/hooks/useSettings';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const params = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const tabParam = params.get('tab');
        if (tabParam && ['profile', 'security', 'billing', 'api'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [params]);

    const {
        profile,
        isLoading,
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

    const tabs = [
        { value: 'profile', icon: User, label: 'Profile' },
        { value: 'security', icon: Shield, label: 'Security' },
        { value: 'billing', icon: CreditCard, label: 'Billing' },
        { value: 'api', icon: Key, label: 'API' }
    ];

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.replace(`?tab=${tab}`, { scroll: false });
    };

    const renderTabContent = () => {
        const tabComponents = {
            'profile': (
                <ProfileInformation
                    profile={profile}
                    onNameUpdate={handleNameUpdate}
                    onAvatarUpdate={handleImageUpload}
                />
            ),
            'security': (
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
            ),
            'billing': (
                <BillingSection
                    profile={profile}
                    payments={payments}
                />
            ),
            'api': (
                <ApiSection
                    profile={profile}
                    isLoading={isLoading}
                    onRegenerateKey={regenerateApiKey}
                />
            )
        };

        return tabComponents[activeTab as keyof typeof tabComponents];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-6xl">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-xl font-semibold">
                            {tabs.find(tab => tab.value === activeTab)?.label}
                        </h1>
                        <div className="flex items-center space-x-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => handleTabChange(tab.value)}
                                    className={`
                                        p-2 rounded-full transition-colors 
                                        ${activeTab === tab.value
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                                    `}
                                >
                                    <tab.icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-12 gap-6 p-6">
                    {/* Sidebar */}
                    <div className="col-span-3 bg-white rounded-xl shadow-sm p-4 space-y-2 self-start sticky top-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={`
                                    w-full flex items-center justify-between p-3 rounded-lg 
                                    transition-colors duration-200
                                    ${activeTab === tab.value
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-gray-100'}
                                `}
                            >
                                <div className="flex items-center space-x-3">
                                    <tab.icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-50" />
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="col-span-9 bg-white rounded-xl shadow-sm p-6">
                        {renderTabContent()}
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="md:hidden p-4 bg-white">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}