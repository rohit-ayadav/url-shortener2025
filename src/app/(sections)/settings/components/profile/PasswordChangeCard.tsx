import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface PasswordChangeCardProps {
    passwordForm: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    isChangingPassword: boolean;
    onPasswordFormChange: (field: string, value: string) => void;
    onPasswordChange: () => void;
}

export function PasswordChangeCard({
    passwordForm,
    isChangingPassword,
    onPasswordFormChange,
    onPasswordChange
}: PasswordChangeCardProps) {
    return (
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
                        onChange={(e) => onPasswordFormChange('currentPassword', e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => onPasswordFormChange('newPassword', e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => onPasswordFormChange('confirmPassword', e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={onPasswordChange}
                    disabled={isChangingPassword}
                >
                    {isChangingPassword && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Change Password
                </Button>
            </CardFooter>
        </Card>
    );
}
