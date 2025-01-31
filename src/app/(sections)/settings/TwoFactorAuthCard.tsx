import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { CheckCircle2, QrCode } from 'lucide-react';
import { UserProfile } from '@/types/types';

interface TwoFactorAuthCardProps {
    profile: UserProfile;
    isLoading: boolean;
    showQrCode: boolean;
    verificationCode: string;
    onEnable2FA: () => void;
    onVerify2FA: () => void;
    onVerificationCodeChange: (code: string) => void;
}

export function TwoFactorAuthCard({
    profile,
    isLoading,
    showQrCode,
    verificationCode,
    onEnable2FA,
    onVerify2FA,
    onVerificationCodeChange
}: TwoFactorAuthCardProps) {
    return (
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
                            <Button onClick={onEnable2FA} disabled={isLoading}>
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
                                        onChange={(e) => onVerificationCodeChange(e.target.value)}
                                        maxLength={6}
                                    />
                                </div>
                                <Button onClick={onVerify2FA} disabled={isLoading}>
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
    );
}
