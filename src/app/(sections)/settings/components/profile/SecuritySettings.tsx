// components/profile/SecuritySettings.tsx
import { UserProfile } from "@/types/types";
import { PasswordChangeCard } from "./PasswordChangeCard";
import { TwoFactorAuthCard } from "../../TwoFactorAuthCard";

interface SecuritySettingsProps {
    profile: UserProfile;
    isLoading: boolean;
    isChangingPassword: boolean;
    showQrCode: boolean;
    verificationCode: string;
    passwordForm: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    onPasswordFormChange: (field: string, value: string) => void;
    onPasswordChange: () => void;
    onEnable2FA: () => void;
    onVerify2FA: () => void;
    onVerificationCodeChange: (code: string) => void;
}

export function SecuritySettings({
    profile,
    isLoading,
    isChangingPassword,
    showQrCode,
    verificationCode,
    passwordForm,
    onPasswordFormChange,
    onPasswordChange,
    onEnable2FA,
    onVerify2FA,
    onVerificationCodeChange
}: SecuritySettingsProps) {
    return (
        <div className="space-y-6">
            <PasswordChangeCard
                passwordForm={passwordForm}
                isChangingPassword={isChangingPassword}
                onPasswordFormChange={onPasswordFormChange}
                onPasswordChange={onPasswordChange}
            />
            <TwoFactorAuthCard
                profile={profile}
                isLoading={isLoading}
                showQrCode={showQrCode}
                verificationCode={verificationCode}
                onEnable2FA={onEnable2FA}
                onVerify2FA={onVerify2FA}
                onVerificationCodeChange={onVerificationCodeChange}
            />
        </div>
    );
}